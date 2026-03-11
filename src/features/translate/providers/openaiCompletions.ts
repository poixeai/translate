import OpenAI from "openai";
import type { ProviderTranslateFn } from "@/types/translate";

export const streamWithOpenAICompletions: ProviderTranslateFn = async ({
    provider,
    model,
    sourceText,
    promptContent,
    onDelta,
    signal,
}) => {
    const client = new OpenAI({
        apiKey: provider.api_key,
        baseURL: `${provider.base_url}/v1`,
        dangerouslyAllowBrowser: true, // 如果在浏览器端调用需要这个
        timeout: 60 * 1000, // 60 秒
    });

    const stream = await client.chat.completions.create(
        {
            model,
            stream: true,
            messages: [
                { role: "system", content: promptContent },
                { role: "user", content: sourceText },
            ],
        },
        {
            signal,
        }
    );

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            onDelta(content);
        }
    }
};
