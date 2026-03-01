import { useThemeStore, type ThemeMode } from "@/stores/theme.store";
import { Monitor, Moon, Sun } from "lucide-react";
import type React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const items: { mode: ThemeMode; labelKey: string; icon: React.ReactNode }[] = [
    { mode: "light", labelKey: "common.theme.light", icon: < Sun className="h-4 w-4" /> },
    { mode: "dark", labelKey: "common.theme.dark", icon: < Moon className="h-4 w-4" /> },
    { mode: "system", labelKey: "common.theme.system", icon: < Monitor className="h-4 w-4" /> },
]

export default function ThemeSwitcher() {
    const mode = useThemeStore((s) => s.mode);
    const setMode = useThemeStore((s) => s.setMode);
    const current = items.find(i => i.mode === mode)

    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:cursor-pointer"
                >
                    {current?.icon}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
            >
                {items.map((it) => (
                    <DropdownMenuItem key={it.mode} onClick={() => setMode(it.mode)} className="hover:cursor-pointer">
                        <span>{it.icon}</span>
                        {/* {t(it.labelKey)} */}
                        <span className="ml-2">{t(it.labelKey)}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}