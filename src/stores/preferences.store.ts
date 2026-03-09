import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedModel = {
    providerId: number;
    model: string;
}

type PrefereneceState = {
    selectedModel: SelectedModel | null;
    // 后续扩展：targetLanguage、promptId 等

    setSelectedModel: (value: SelectedModel | null) => void;
    // 后续扩展：setTargetLanguage、setPromptId 等
}

export const usePreferences = create<PrefereneceState>()(
    persist(
        (set) => ({
            selectedModel: null,

            setSelectedModel: (value) => set({ selectedModel: value }),
        }),
        {
            name: "poixe_translate_preferences", // localStorage key
            version: 1,
        }
    )
)