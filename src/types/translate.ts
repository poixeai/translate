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
    signal?: AbortSignal; // 暂时取消，后续做“停止翻译”功能时再加回来
};

export type ProviderTranslateFn = (params: TranslateExecuteParams) => Promise<void>;

export type TranslateError = {
    code?: string;
    message?: string;
    status?: number;
    body?: string;
};