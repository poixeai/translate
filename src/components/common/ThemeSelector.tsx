import { Monitor, Moon, Sun } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useThemeStore, type ThemeMode } from "@/stores/theme.store";
import { useTranslation } from "react-i18next";

const items: { mode: ThemeMode; labelKey: string; icon: React.ReactNode }[] = [
    { mode: "system", labelKey: "common.settings.theme.system", icon: < Monitor className="h-4 w-4" /> },
    { mode: "light", labelKey: "common.settings.theme.light", icon: < Sun className="h-4 w-4" /> },
    { mode: "dark", labelKey: "common.settings.theme.dark", icon: < Moon className="h-4 w-4" /> },
]

export default function ThemeSelector() {
    const mode = useThemeStore((s) => s.mode);
    const setMode = useThemeStore((s) => s.setMode);

    const { t } = useTranslation();

    return (
        <>
            <Select value={mode} onValueChange={(v) => setMode(v as ThemeMode)}>
                <SelectTrigger className="hover:cursor-pointer">
                    <SelectValue placeholder={t("common.settings.theme.select")} />
                </SelectTrigger>
                <SelectContent position="popper" className="dark:bg-[#353535]">
                    {items.map((it) => (
                        <SelectItem key={it.mode} value={it.mode} className="hover:cursor-pointer">
                            {t(it.labelKey)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}