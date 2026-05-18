import { useCallback, useRef, useState } from "react";
import { api } from "@/lib/api";
import { usePreferences } from "@/stores/preferences.store";
import type { TranslateError } from "@/types/translate";

export function useTranslate() {
    const [isTranslating, setIsTranslating] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const [translateError, setTranslateError] = useState<TranslateError | null>(null);
    const isTranslatingRef = useRef(false);

    const handleTranslate = useCallback(async () => {
        if (isTranslatingRef.current) return;
        isTranslatingRef.current = true;

        const {
            sourceText,
            sourceLanguage,
            targetLanguage,
            translationMode,
            selectedModel,
            selectedPromptId,
            setTranslatedText,
        } = usePreferences.getState();

        if (!sourceText.trim() || !selectedModel || selectedPromptId == null) {
            isTranslatingRef.current = false;
            return;
        }

        setIsTranslating(true);
        setTranslateError(null);
        setTranslatedText("");

        try {
            const stream = api.translate({
                source_text: sourceText,
                source_language: sourceLanguage,
                target_language: targetLanguage,
                translation_mode: translationMode,
                provider_id: selectedModel.providerId,
                model: selectedModel.model,
                prompt_id: selectedPromptId,
            });

            abortRef.current = new AbortController();
            abortRef.current.signal.addEventListener("abort", () => {
                stream.abort();
            });

            stream.onDelta((delta) => {
                const current = usePreferences.getState().translatedText;
                usePreferences.getState().setTranslatedText(current + delta);
            });

            stream.onError((error) => {
                setTranslateError({ message: error });
                setIsTranslating(false);
                abortRef.current = null;
                isTranslatingRef.current = false;
            });

            stream.onComplete(() => {
                setIsTranslating(false);
                abortRef.current = null;
                isTranslatingRef.current = false;
            });
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                setIsTranslating(false);
                abortRef.current = null;
                isTranslatingRef.current = false;
                return;
            }

            if (typeof error === "object" && error !== null) {
                const e = error as { message?: string; status?: number; body?: string };
                setTranslateError({
                    message: e.message ?? "Translation failed",
                    status: e.status,
                    body: e.body,
                });
            } else {
                setTranslateError({
                    message: "Translation failed",
                    body: String(error),
                });
            }

            setIsTranslating(false);
            abortRef.current = null;
            isTranslatingRef.current = false;
        }
    }, []);

    const stopTranslate = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    return {
        isTranslating,
        handleTranslate,
        stopTranslate,
        translateError,
        setTranslateError,
    };
}
