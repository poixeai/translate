
export const API_STYLES_OPTIONS = [
    {value: "openai_completions", label: "OpenAI", url: "/v1/chat/completions" },
    {value: "openai_responses", label: "OpenAI Responses", url: "/v1/responses" },
    {value: "anthropic_messages", label: "Anthropic", url: "/v1/messages" },
    {value: "google_gemini_content", label: "Google Gemini", url: "/v1beta/models/*action" },
] as const;

export type APIStyle = (typeof API_STYLES_OPTIONS)[number]["value"];

// value -> label 的映射
export const API_STYLES_LABEL_MAP: Record<APIStyle, string> = Object.fromEntries(
    API_STYLES_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<APIStyle, string>;

// 便捷函数
export function getAPIStyleLabel(style: APIStyle): string {
    return API_STYLES_LABEL_MAP[style] ?? style;
}

export interface ModelProvider {
    id?: number;
    name: string;
    base_url: string;
    api_key: string;
    api_style: APIStyle;
    models: string;
    created_at: number;
    updated_at: number;
}