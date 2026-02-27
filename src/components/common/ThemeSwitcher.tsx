import { useThemeStore, type ThemeMode } from "@/stores/theme.store";
import { Monitor, Moon, Sun } from "lucide-react";
import type React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const items: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: "light", label: "Light", icon: < Sun className="h-4 w-4" /> },
    { mode: "dark", label: "Dark", icon: < Moon className="h-4 w-4" /> },
    { mode: "system", label: "System", icon: < Monitor className="h-4 w-4" /> },
]

export default function ThemeSwitcher() {
    const mode = useThemeStore((s) => s.mode);
    const setMode = useThemeStore((s) => s.setMode);
    const current = items.find(i => i.mode === mode)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                    {current?.icon}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {items.map((it) => (
                    <DropdownMenuItem key={it.mode} onClick={() => setMode(it.mode)} className="hover:cursor-pointer">
                        <span>{it.icon}</span>
                        {it.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}