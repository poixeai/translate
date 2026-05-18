import { useEffect, useState } from "react";

import { api } from "@/lib/api";

export type ModelProvider = {
    id: number;
    name: string;
    models: string[];
};

function parseModels(models: string): string[] {
    return models
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean);
}

export function useModels() {
    const [providers, setProviders] = useState<ModelProvider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.listProviders()
            .then((data) => {
                setProviders(
                    data.providers.map((provider) => ({
                        id: provider.id,
                        name: provider.name,
                        models: parseModels(provider.models),
                    }))
                );
            })
            .finally(() => setLoading(false));
    }, []);

    return { providers, loading };
}
