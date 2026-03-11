import { useCallback, useRef, useState } from "react";
import { runTranslate } from "../services/translate";

export function useTranslate() {
    const [isTranslating, setIsTranslating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

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
            throw error;
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
    };
}