import Anthropic from "@anthropic-ai/sdk";
import type { ProviderTranslateFn } from "@/types/translate";

export const streamWithAnthropicMessages: ProviderTranslateFn = async ({
    provider,
    model,
    sourceText,
    promptContent,
    onDelta,
    signal,
}) => {
    try {
        const client = new Anthropic({
            apiKey: provider.api_key,
            baseURL: provider.base_url,
            dangerouslyAllowBrowser: true,
            timeout: 60 * 1000, // 60 seconds timeout
        });

        const stream = await client.messages.create(
            {
                model,
                max_tokens: 4096,
                stream: true,
                system: promptContent,
                messages: [
                    {
                        role: "user",
                        content: sourceText,
                    },
                ],
            },
            {
                signal,
            }
        );

        for await (const event of stream) {
            if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
            ) {
                if (event.delta.text) {
                    onDelta(event.delta.text);
                }
            }
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }

        if (error instanceof Anthropic.APIError) {
            throw {
                message: error.message,
                status: error.status,
                body: error.error ? JSON.stringify(error.error, null, 2) : undefined,
            };
        }

        if (error instanceof Error) {
            throw {
                message: error.message,
            };
        }

        throw {
            message: "Anthropic request failed",
        };
    }
};