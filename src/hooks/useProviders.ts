import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import type { ModelProvider } from "@/types/providers";

export type CreateProviderInput = Omit<ModelProvider, "id" | "created_at" | "updated_at">;
export type UpdateProviderPatch = Partial<Omit<ModelProvider, "id">>;

export function useProviders() {
    // 实时获取所有列表数据 (数据库一变，UI 自动更新)
    const providers = useLiveQuery(
        async () => {
            return db.model_providers.orderBy("updated_at").reverse().toArray();
        }, [], [] as ModelProvider[]
    );

    // 添加数据
    const create = useCallback(async (input: CreateProviderInput) => {
        const now = Date.now();
        await db.model_providers.add({
            ...input,
            created_at: now,
            updated_at: now,
        })
    }, []);

    // 更新数据
    const update = useCallback(async (id: number, patch: UpdateProviderPatch) => {
        await db.model_providers.update(id, {
            ...patch,
            updated_at: Date.now(),
        })
    }, []);

    // 删除数据
    const remove = useCallback(async (id: number) => {
        await db.model_providers.delete(id);
    }, []);

    return { providers, create, update, remove };
}