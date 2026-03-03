import type { TranslationPrompt } from "@/types/prompts";
import type { ModelProvider } from "@/types/providers";
import Dexie, { type Table } from "dexie";

export class AppDB extends Dexie {
    model_providers!: Table<ModelProvider, number>;
    translation_prompts!: Table<TranslationPrompt, number>;

    constructor() {
        super("poixe_translate_db");

        this.version(1).stores({
            model_providers: "++id, name, created_at, updated_at",
            translation_prompts: "++id, name, created_at, updated_at",
        })
    }
}

export const db = new AppDB();