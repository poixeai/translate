import { useCallback, useState } from "react";
import { runTranslate } from "../services/translate";

export function useTranslate() {
    const [isTranslating, setIsTranslating] = useState(false);

    const handleTranslate = useCallback(async () => {
        if (isTranslating) return;

        try {
            setIsTranslating(true);
            await runTranslate();
        } finally {
            setIsTranslating(false);
        }
    }, [isTranslating]);

    return {
        isTranslating,
        handleTranslate,
    };
}