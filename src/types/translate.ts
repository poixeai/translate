import type { ModelProvider } from "./providers";

export type TranslateExecuteParams = {
    provider: Pick<
        ModelProvider,
        "id" | "name" | "base_url" | "api_key" | "api_style"
    >;
    model: string;
    targetLanguage: string;
    sourceText: string;
    promptContent: string;
    onDelta: (text: string) => void;
    signal?: AbortSignal;
};

export type ProviderTranslateFn = (params: TranslateExecuteParams) => Promise<void>;

export type TranslateError = {
    code?: string;
    message?: string;
    status?: number;
    body?: string;
};