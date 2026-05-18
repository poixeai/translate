import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export type TranslationPrompt = {
    id: number;
    name: string;
    content: string;
    is_system: boolean;
    created_at: number;
    updated_at: number;
};

export function usePromptsApi() {
    const [prompts, setPrompts] = useState<TranslationPrompt[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPrompts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.listPrompts();
            setPrompts(data.prompts || []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

    const create = useCallback(async (input: { name: string; content: string }) => {
        await api.createPrompt(input);
        await fetchPrompts();
    }, [fetchPrompts]);

    const update = useCallback(async (id: number, patch: Partial<TranslationPrompt>) => {
        await api.updatePrompt(id, patch);
        await fetchPrompts();
    }, [fetchPrompts]);

    const remove = useCallback(async (id: number) => {
        await api.deletePrompt(id);
        await fetchPrompts();
    }, [fetchPrompts]);

    return { prompts, loading, create, update, remove, refetch: fetchPrompts };
}
