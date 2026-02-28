import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
    { code: "en", label: "English", short: "EN" },
    { code: "zh-CN", label: "简体中文", short: "CN" },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || "en";

    const handleChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("i18nextLng", lang);
    };

    const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Change language"
                    className="hover:cursor-pointer"
                >
                    {current.short}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
            >
                {LANGUAGES.map((lang) => {
                    return (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => handleChange(lang.code)}
                            className="flex justify-between items-center px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors"
                        >
                            <span>{lang.label}</span>
                            <span className="text-xs opacity-70">{lang.short}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
