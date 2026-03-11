import { useCallback, useRef, useState } from "react";
import { runTranslate } from "../services/translate";
import type { TranslateError } from "@/types/translate";
import { TranslateKnownError } from "../services/translateError";

export function useTranslate() {
    const [isTranslating, setIsTranslating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [translateError, setTranslateError] = useState<TranslateError | null>(null);

    const handleTranslate = useCallback(async () => {
        if (isTranslating) return;

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setIsTranslating(true);
            await runTranslate(controller.signal);
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            if (error instanceof TranslateKnownError) {
                setTranslateError({
                    code: error.code,
                });
                return;
            }

            if (typeof error === "object" && error !== null) {
                const e = error as {
                    message?: string;
                    status?: number;
                    body?: string;
                };

                setTranslateError({
                    message: e.message ?? "Translation failed",
                    status: e.status,
                    body: e.body,
                });
                return;
            }

            setTranslateError({
                message: "Translation failed",
                body: String(error),
            });
        } finally {
            setIsTranslating(false);
            abortControllerRef.current = null;
        }
    }, [isTranslating]);

    const stopTranslate = useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);

    return {
        isTranslating,
        handleTranslate,
        stopTranslate,
        translateError,
        setTranslateError,
    };
}