import { create } from "zustand";
import { api } from "@/lib/api";

export type SelectedModel = {
    providerId: number;
    model: string;
}

export type TranslationMode = "manual" | "zh_en_auto";

export const AUTO_SOURCE_LANGUAGE = "auto";

type PreferenceState = {
    selectedModel: SelectedModel | null;
    translationMode: TranslationMode;
    sourceLanguage: string;
    targetLanguage: string;
    selectedPromptId: number | null;
    sourceText: string;
    translatedText: string;
    theme: string;
    locale: string;

    setSelectedModel: (value: SelectedModel | null) => void;
    setTranslationMode: (mode: TranslationMode) => void;
    setSourceLanguage: (code: string) => void;
    setTargetLanguage: (code: string) => void;
    setSelectedPromptId: (id: number | null) => void;
    setSourceText: (value: string) => void;
    setTranslatedText: (value: string) => void;
    setTheme: (theme: string) => void;
    setLocale: (locale: string) => void;
    loadFromServer: (data: Record<string, unknown>) => void;
    syncToServer: () => Promise<void>;
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

const SYNCABLE_KEYS = [
    "selectedModel",
    "translationMode",
    "sourceLanguage",
    "targetLanguage",
    "selectedPromptId",
    "theme",
    "locale",
] as const;

function scheduleSync() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
        usePreferences.getState().syncToServer();
    }, 1000);
}

export const usePreferences = create<PreferenceState>()(
    (set, get) => ({
        selectedModel: null,
        translationMode: "manual",
        sourceLanguage: AUTO_SOURCE_LANGUAGE,
        targetLanguage: "",
        selectedPromptId: null,
        sourceText: "",
        translatedText: "",
        theme: "system",
        locale: "en",

        setSelectedModel: (value) => { set({ selectedModel: value }); scheduleSync(); },
        setTranslationMode: (mode) => { set({ translationMode: mode }); scheduleSync(); },
        setSourceLanguage: (code) => { set({ sourceLanguage: code }); scheduleSync(); },
        setTargetLanguage: (code) => { set({ targetLanguage: code }); scheduleSync(); },
        setSelectedPromptId: (id) => { set({ selectedPromptId: id }); scheduleSync(); },
        setSourceText: (value) => { set({ sourceText: value }); },
        setTranslatedText: (value) => { set({ translatedText: value }); },
        setTheme: (theme) => { set({ theme }); scheduleSync(); },
        setLocale: (locale) => { set({ locale }); scheduleSync(); },

        loadFromServer: (data) => {
            const patch: Partial<PreferenceState> = {};
            if (data.selectedModel && typeof data.selectedModel === "object") {
                patch.selectedModel = data.selectedModel as SelectedModel;
            }
            if (data.translationMode && typeof data.translationMode === "string") {
                patch.translationMode = data.translationMode as TranslationMode;
            }
            if (typeof data.sourceLanguage === "string") {
                patch.sourceLanguage = data.sourceLanguage;
            }
            if (typeof data.targetLanguage === "string") {
                patch.targetLanguage = data.targetLanguage;
            }
            if (typeof data.selectedPromptId === "number") {
                patch.selectedPromptId = data.selectedPromptId;
            }
            if (typeof data.theme === "string") {
                patch.theme = data.theme;
            }
            if (typeof data.locale === "string") {
                patch.locale = data.locale;
            }
            set(patch);
        },

        syncToServer: async () => {
            const state = get();
            const payload: Record<string, unknown> = {};
            for (const key of SYNCABLE_KEYS) {
                payload[key] = state[key];
            }
            try {
                await api.updatePreferences(payload);
            } catch {}
        },
    })
)
