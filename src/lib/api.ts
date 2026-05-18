import type { APIStyle } from "@/types/providers";

import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from "@/lib/auth-session";

const BASE_URL = "/api/v1";

type TranslateParams = {
    source_text: string;
    source_language: string;
    target_language: string;
    translation_mode: string;
    provider_id: number;
    model: string;
    prompt_id: number;
};

type LoginParams = {
    username: string;
    password: string;
};

type TokenPayload = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};

type SSEStream = {
    onDelta: (handler: (delta: string) => void) => SSEStream;
    onError: (handler: (error: string) => void) => SSEStream;
    onComplete: (handler: () => void) => SSEStream;
    abort: () => void;
};

type ProviderPayload = {
    id: number;
    name: string;
    base_url: string;
    api_key: string;
    api_style: APIStyle;
    models: string;
    created_at: number;
    updated_at: number;
};

type PromptPayload = {
    id: number;
    name: string;
    content: string;
    is_system: boolean;
    created_at: number;
    updated_at: number;
};

type UserPayload = {
    id: number;
    username: string;
    role: "ADMIN" | "USER";
    display_name: string;
    email: string;
    created_at: number;
};

type ApiEnvelope<T> = T | { data: T };

type RequestOptions = RequestInit & {
    skipAuth?: boolean;
    retryOnAuth?: boolean;
};

type DeltaHandler = (delta: string) => void;
type ErrorHandler = (error: string) => void;
type CompleteHandler = () => void;

let refreshPromise: Promise<boolean> | null = null;

function buildHeaders(init?: RequestOptions): Headers {
    const headers = new Headers(init?.headers);
    if (init?.body !== undefined && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (!init?.skipAuth) {
        const token = getAccessToken();
        if (token && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    return headers;
}

function getFetchOptions(init?: RequestOptions): RequestInit {
    const options: RequestInit = { ...(init ?? {}) };
    delete (options as RequestOptions).skipAuth;
    delete (options as RequestOptions).retryOnAuth;

    return {
        ...options,
        headers: buildHeaders(init),
    };
}

async function parseJsonSafely<T>(res: Response): Promise<T | undefined> {
    if (res.status === 204) return undefined;

    const text = await res.text().catch(() => "");
    if (!text) return undefined;

    try {
        return JSON.parse(text) as T;
    } catch {
        return undefined;
    }
}

function unwrapData<T>(payload: ApiEnvelope<T> | undefined): T {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }
    return payload as T;
}

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearAuthTokens();
        return false;
    }

    if (!refreshPromise) {
        refreshPromise = (async () => {
            const res = await fetch(`${BASE_URL}/auth/refresh`, getFetchOptions({
                method: "POST",
                body: JSON.stringify({ refresh_token: refreshToken }),
                skipAuth: true,
                retryOnAuth: false,
            }));

            const payload = await parseJsonSafely<TokenPayload | { error?: string }>(res);
            if (!res.ok || !payload || !("access_token" in payload) || !("refresh_token" in payload)) {
                clearAuthTokens();
                return false;
            }

            saveAuthTokens(payload.access_token, payload.refresh_token);
            return true;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

async function performRequest(path: string, init?: RequestOptions): Promise<Response> {
    const retryOnAuth = init?.retryOnAuth ?? !init?.skipAuth;
    let res = await fetch(`${BASE_URL}${path}`, getFetchOptions(init));

    if (res.status === 401 && retryOnAuth) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            res = await fetch(`${BASE_URL}${path}`, getFetchOptions({ ...init, retryOnAuth: false }));
        }
    }

    return res;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
    const res = await performRequest(path, init);
    const payload = await parseJsonSafely<unknown>(res);
    if (!res.ok) {
        const errorPayload = payload as { error?: string } | undefined;
        throw {
            message: errorPayload?.error ?? `Request failed: ${res.status}`,
            status: res.status,
            body: payload,
        };
    }

    return payload as T;
}

function createSSEStream(path: string, body: unknown): SSEStream {
    const controller = new AbortController();
    const serializedBody = JSON.stringify(body);
    let deltaHandler: DeltaHandler | null = null;
    let errorHandler: ErrorHandler | null = null;
    let completeHandler: CompleteHandler | null = null;

    const stream: SSEStream = {
        onDelta: (handler) => {
            deltaHandler = handler;
            return stream;
        },
        onError: (handler) => {
            errorHandler = handler;
            return stream;
        },
        onComplete: (handler) => {
            completeHandler = handler;
            return stream;
        },
        abort: () => controller.abort(),
    };

    void (async () => {
        try {
            const res = await performRequest(path, {
                method: "POST",
                body: serializedBody,
                signal: controller.signal,
            });

            if (!res.ok) {
                const payload = await parseJsonSafely<{ error?: string }>(res);
                (errorHandler as ErrorHandler | null)?.(payload?.error ?? `HTTP ${res.status}`);
                (completeHandler as CompleteHandler | null)?.();
                return;
            }

            const reader = res.body?.getReader();
            if (!reader) {
                (errorHandler as ErrorHandler | null)?.("No response body");
                (completeHandler as CompleteHandler | null)?.();
                return;
            }

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    const data = line.slice(6);
                    if (data === "[DONE]") continue;

                    try {
                        const parsed = JSON.parse(data) as { error?: string; delta?: string; content?: string; text?: string };
                        if (parsed.error) {
                            (errorHandler as ErrorHandler | null)?.(parsed.error);
                            continue;
                        }

                        const delta = parsed.delta ?? parsed.content ?? parsed.text ?? "";
                        if (delta) {
                            (deltaHandler as DeltaHandler | null)?.(delta);
                        }
                    } catch {
                        if (data.trim()) {
                            (deltaHandler as DeltaHandler | null)?.(data);
                        }
                    }
                }
            }

            (completeHandler as CompleteHandler | null)?.();
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") {
                (completeHandler as CompleteHandler | null)?.();
                return;
            }

            (errorHandler as ErrorHandler | null)?.(err instanceof Error ? err.message : String(err));
            (completeHandler as CompleteHandler | null)?.();
        }
    })();

    return stream;
}

export const api = {
    async login(credentials: LoginParams) {
        const payload = await request<TokenPayload>("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            skipAuth: true,
            retryOnAuth: false,
        });
        saveAuthTokens(payload.access_token, payload.refresh_token);
        return payload;
    },

    logout: () =>
        request("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refresh_token: getRefreshToken() }),
            skipAuth: true,
            retryOnAuth: false,
        }),

    translate(params: TranslateParams): SSEStream {
        return createSSEStream("/translate/stream", {
            provider_id: params.provider_id,
            model_name: params.model,
            prompt_id: params.prompt_id,
            source_text: params.source_text,
            target_lang: params.target_language,
            source_lang: params.source_language,
        });
    },

    async listProviders() {
        const providers = unwrapData<ProviderPayload[]>(await request<ApiEnvelope<ProviderPayload[]>>("/providers"));
        return { providers };
    },

    createProvider: (input: { name: string; base_url: string; api_key: string; api_style: APIStyle; models: string }) =>
        request("/providers", { method: "POST", body: JSON.stringify(input) }),

    updateProvider: (id: number, patch: Partial<ProviderPayload>) =>
        request(`/providers/${id}`, { method: "PUT", body: JSON.stringify(patch) }),

    deleteProvider: (id: number) =>
        request(`/providers/${id}`, { method: "DELETE" }),

    async listPrompts() {
        const prompts = unwrapData<PromptPayload[]>(await request<ApiEnvelope<PromptPayload[]>>("/prompts"));
        return { prompts };
    },

    createPrompt: (input: { name: string; content: string }) =>
        request("/prompts", { method: "POST", body: JSON.stringify(input) }),

    updatePrompt: (id: number, patch: Record<string, unknown>) =>
        request(`/prompts/${id}`, { method: "PUT", body: JSON.stringify(patch) }),

    deletePrompt: (id: number) =>
        request(`/prompts/${id}`, { method: "DELETE" }),

    async listModels(providerId: number) {
        return unwrapData<string[]>(await request<ApiEnvelope<string[]>>(`/providers/${providerId}/models`));
    },

    async getPreferences() {
        const payload = unwrapData<Record<string, unknown>>(await request<ApiEnvelope<Record<string, unknown>>>("/preferences"));
        const providerId = payload.selected_model_provider_id;
        const modelName = payload.selected_model_name;

        return {
            selectedModel: typeof providerId === "number" && typeof modelName === "string"
                ? { providerId, model: modelName }
                : null,
            translationMode: typeof payload.translation_mode === "string" ? payload.translation_mode : "manual",
            sourceLanguage: typeof payload.source_language === "string" ? payload.source_language : "auto",
            targetLanguage: typeof payload.target_language === "string" ? payload.target_language : "",
            selectedPromptId: typeof payload.selected_prompt_id === "number" ? payload.selected_prompt_id : null,
            theme: typeof payload.theme === "string" ? payload.theme : "system",
            locale: typeof payload.locale === "string" ? payload.locale : "en",
        };
    },

    updatePreferences: (data: Record<string, unknown>) => {
        const selectedModel = (data.selectedModel ?? null) as { providerId: number; model: string } | null;
        const payload = {
            translation_mode: data.translationMode ?? "manual",
            source_language: data.sourceLanguage ?? "auto",
            target_language: data.targetLanguage ?? "",
            selected_model_provider_id: selectedModel?.providerId ?? null,
            selected_model_name: selectedModel?.model ?? "",
            selected_prompt_id: data.selectedPromptId ?? null,
            theme: data.theme ?? "system",
            locale: data.locale ?? "en",
        };
        return request("/preferences", { method: "PUT", body: JSON.stringify(payload) });
    },

    async getCurrentUser() {
        const payload = await request<{ user?: UserPayload; user_id?: number; username?: string; role?: "ADMIN" | "USER" }>("/auth/me");
        const user = payload.user ?? {
            id: payload.user_id ?? 0,
            username: payload.username ?? "",
            role: payload.role ?? "USER",
            display_name: "",
            email: "",
            created_at: 0,
        };
        return { user };
    },

    async listUsers() {
        const users = unwrapData<UserPayload[]>(await request<ApiEnvelope<UserPayload[]>>("/users"));
        return { users };
    },

    createUser: (input: { username: string; password: string; role: "ADMIN" | "USER"; display_name: string; email: string }) =>
        request("/users", { method: "POST", body: JSON.stringify(input) }),

    updateUser: (id: number, patch: { role?: "ADMIN" | "USER"; display_name?: string; email?: string }) =>
        request(`/users/${id}`, { method: "PUT", body: JSON.stringify(patch) }),

    changeUserPassword: (id: number, password: string) =>
        request(`/users/${id}/password`, { method: "PUT", body: JSON.stringify({ password }) }),

    deleteUser: (id: number) =>
        request(`/users/${id}`, { method: "DELETE" }),
};
