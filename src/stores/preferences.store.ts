import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedModel = {
    providerId: number;
    model: string;
}

type PrefereneceState = {
    selectedModel: SelectedModel | null;
    targetLanguage: string;
    selectedPromptId: number | null;
    // 后续扩展：targetLanguage、promptId 等
    sourceText: string;
    translatedText: string;

    setSelectedModel: (value: SelectedModel | null) => void;
    setTargetLanguage: (code: string) => void;
    setSelectedPromptId: (id: number | null) => void;
    // 后续扩展：setTargetLanguage、setPromptId 等
    setSourceText: (value: string) => void;
    setTranslatedText: (value: string) => void;
}

export const usePreferences = create<PrefereneceState>()(
    persist(
        (set) => ({
            selectedModel: null,
            targetLanguage: "",
            selectedPromptId: null,
            sourceText: "",
            translatedText: "",

            setSelectedModel: (value) => set({ selectedModel: value }),
            setTargetLanguage: (code) => set({ targetLanguage: code }),
            setSelectedPromptId: (id) => set({ selectedPromptId: id }),
            setSourceText: (value) => set({ sourceText: value }),
            setTranslatedText: (value) => set({ translatedText: value }),
        }),
        {
            name: "poixe_translate_preferences", // localStorage key
            version: 1,
        }
    )
)