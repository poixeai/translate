import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "theme-mode";

function getInitialMode(): ThemeMode {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
    }
    return "system";
}

export const useThemeStore = create<ThemeState>((set) => ({
    mode: typeof window === "undefined" ? "system" : getInitialMode(),
    setMode: (mode) => {
        localStorage.setItem(STORAGE_KEY, mode);
        set({ mode });
    }
}))