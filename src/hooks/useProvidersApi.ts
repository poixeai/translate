import { useCallback, useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { APIStyle } from "@/types/providers";

export type Provider = {
    id: number;
    name: string;
    base_url: string;
    api_key: string;
    api_style: APIStyle;
    models: string;
    created_at: number;
    updated_at: number;
};

export function useProvidersApi() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.listProviders();
            setProviders(data.providers || []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    const create = useCallback(async (input: Omit<Provider, "id" | "created_at" | "updated_at">) => {
        await api.createProvider(input);
        await fetchProviders();
    }, [fetchProviders]);

    const update = useCallback(async (id: number, patch: Partial<Provider>) => {
        await api.updateProvider(id, patch);
        await fetchProviders();
    }, [fetchProviders]);

    const remove = useCallback(async (id: number) => {
        await api.deleteProvider(id);
        await fetchProviders();
    }, [fetchProviders]);

    return { providers, loading, create, update, remove, refetch: fetchProviders };
}
