import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import type { TranslationPrompt } from "@/types/prompts";

export type CreatePromptInput = Omit<TranslationPrompt, "id" | "created_at" | "updated_at">;
export type UpdatePromptPatch = Partial<Omit<TranslationPrompt, "id">>;

export function usePrompts() {
    // 获取列表
    const prompts = useLiveQuery(
        async () => {
            return db.translation_prompts.orderBy("updated_at").reverse().toArray();
        }, [], [] as TranslationPrompt[]
    )

    // 添加数据
    const create = useCallback(async (input: CreatePromptInput) => {
        const now = Date.now();
        await db.translation_prompts.add({
            ...input,
            created_at: now,
            updated_at: now,
        })
    }, [])

    // 更新数据
    const update = useCallback(async (id: number, patch: UpdatePromptPatch) => {
        await db.translation_prompts.update(id, {
            ...patch,
            updated_at: Date.now(),
        })
    }, [])

    // 删除数据
    const remove = useCallback(async (id: number) => {
        await db.translation_prompts.delete(id);
    }, [])

    return { prompts, create, update, remove };
}