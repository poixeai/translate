import { useThemeStore } from "@/stores/theme.store";
import { useEffect } from "react";

function applyTheme(mode: "light" | "dark" | "system") {
    const root = document.documentElement;

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = mode === "dark" || (mode === "system" && systemDark);

    root.classList.toggle("dark", shouldDark);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const mode = useThemeStore((s) => s.mode);

    // 1. 初始/切换时应用
    useEffect(() => {
        applyTheme(mode);
    }, [mode])

    // 2. system 模式下监听系统变化
    useEffect(() => {
        if (mode !== "system") return;

        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => applyTheme("system");

        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [mode])

    return children
}