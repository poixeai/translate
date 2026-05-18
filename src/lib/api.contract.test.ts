import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "./api";
import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from "./auth-session";

class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length() {
        return this.store.size;
    }

    clear() {
        this.store.clear();
    }

    getItem(key: string) {
        return this.store.has(key) ? this.store.get(key)! : null;
    }

    key(index: number) {
        return Array.from(this.store.keys())[index] ?? null;
    }

    removeItem(key: string) {
        this.store.delete(key);
    }

    setItem(key: string, value: string) {
        this.store.set(key, value);
    }
}

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
}

describe("frontend API contract", () => {
    let storage: MemoryStorage;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        storage = new MemoryStorage();
        Object.defineProperty(globalThis, "window", {
            value: { localStorage: storage },
            configurable: true,
        });

        fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        clearAuthTokens();
    });

    afterEach(() => {
        clearAuthTokens();
        vi.unstubAllGlobals();
    });

    it("persists tokens returned by login", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({
            access_token: "access-1",
            refresh_token: "refresh-1",
            expires_in: 3600,
            token_type: "Bearer",
        }, { status: 200 }));

        await api.login({ username: "admin", password: "Secret123" });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/v1/auth/login");
        expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({ username: "admin", password: "Secret123" });
        expect(getAccessToken()).toBe("access-1");
        expect(getRefreshToken()).toBe("refresh-1");
    });

    it("refreshes expired access tokens before retrying a protected request", async () => {
        saveAuthTokens("expired-access", "refresh-2");

        fetchMock
            .mockResolvedValueOnce(jsonResponse({ error: "invalid or expired token" }, { status: 401 }))
            .mockResolvedValueOnce(jsonResponse({
                access_token: "fresh-access",
                refresh_token: "fresh-refresh",
                expires_in: 3600,
                token_type: "Bearer",
            }, { status: 200 }))
            .mockResolvedValueOnce(jsonResponse({
                user: {
                    id: 1,
                    username: "admin",
                    role: "ADMIN",
                    display_name: "Administrator",
                    email: "",
                    created_at: 1,
                },
            }, { status: 200 }));

        const result = await api.getCurrentUser();

        expect(result.user.username).toBe("admin");
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/v1/auth/refresh");
        expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toEqual({ refresh_token: "refresh-2" });
        expect(fetchMock.mock.calls[2]?.[1]?.headers instanceof Headers).toBe(true);
        const retriedHeaders = fetchMock.mock.calls[2]?.[1]?.headers as Headers;
        expect(retriedHeaders.get("Authorization")).toBe("Bearer fresh-access");
        expect(getAccessToken()).toBe("fresh-access");
        expect(getRefreshToken()).toBe("fresh-refresh");
    });

    it("clears tokens when refresh fails", async () => {
        saveAuthTokens("expired-access", "refresh-3");

        fetchMock
            .mockResolvedValueOnce(jsonResponse({ error: "invalid or expired token" }, { status: 401 }))
            .mockResolvedValueOnce(jsonResponse({ error: "refresh token expired" }, { status: 401 }));

        await expect(api.getCurrentUser()).rejects.toMatchObject({ status: 401 });
        expect(getAccessToken()).toBeNull();
        expect(getRefreshToken()).toBeNull();
    });

    it("maps backend preference payloads into frontend state shape", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({
            data: {
                translation_mode: "manual",
                source_language: "en",
                target_language: "zh",
                selected_model_provider_id: 7,
                selected_model_name: "gpt-4o-mini",
                selected_prompt_id: 3,
                theme: "system",
                locale: "en",
            },
        }, { status: 200 }));

        const result = await api.getPreferences();

        expect(result).toEqual({
            selectedModel: { providerId: 7, model: "gpt-4o-mini" },
            translationMode: "manual",
            sourceLanguage: "en",
            targetLanguage: "zh",
            selectedPromptId: 3,
            theme: "system",
            locale: "en",
        });
    });

    it("maps frontend preference updates into backend payload keys", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} }, { status: 200 }));

        await api.updatePreferences({
            selectedModel: { providerId: 9, model: "claude-sonnet-4-5" },
            translationMode: "manual",
            sourceLanguage: "fr",
            targetLanguage: "en",
            selectedPromptId: 6,
            theme: "dark",
            locale: "zh-CN",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/v1/preferences");
        expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
            translation_mode: "manual",
            source_language: "fr",
            target_language: "en",
            selected_model_provider_id: 9,
            selected_model_name: "claude-sonnet-4-5",
            selected_prompt_id: 6,
            theme: "dark",
            locale: "zh-CN",
        });
    });
});
