import type { ModelProvider } from "@/types/providers";

export type TranslateError = {
    code?: string;
    message?: string;
    status?: number;
    body?: string;
};

export type ProviderTranslateParams = {
    provider: ModelProvider;
    model: string;
    sourceText: string;
    targetLanguage: string;
    promptContent: string;
    onDelta: (delta: string) => void;
    signal?: AbortSignal;
};

export type ProviderTranslateFn = (params: ProviderTranslateParams) => Promise<void>;
