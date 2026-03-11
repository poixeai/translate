import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "en", label: "English", short: "EN" },
    { code: "zh-CN", label: "简体中文", short: "CN" },
    { code: "zh-TW", label: "繁體中文", short: "TW" },
    { code: "ja", label: "日本語", short: "JA" },
    { code: "ko", label: "한국어", short: "KO" },
    { code: "ru", label: "Русский", short: "RU" },
    { code: "fr", label: "Français", short: "FR" },
    { code: "de", label: "Deutsch", short: "DE" },
    { code: "es", label: "Español", short: "ES" },
    { code: "pt", label: "Português", short: "PT" },
    { code: "it", label: "Italiano", short: "IT" },
    { code: "nl", label: "Nederlands", short: "NL" },
    { code: "ar", label: "العربية", short: "AR" },
    { code: "hi", label: "हिन्दी", short: "HI" },
    { code: "id", label: "Bahasa Indonesia", short: "ID" },
];

export default function LanguageSelector() {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language || "en";

    const handleChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("i18nextLng", lang);
    };

    return (
        <>
            <Select value={currentLang} onValueChange={handleChange}>
                <SelectTrigger className="hover:cursor-pointer">
                    <SelectValue placeholder={t("common.settings.language.select")} />
                </SelectTrigger>
                <SelectContent position="popper" className="dark:bg-[#353535]">
                    {LANGUAGES.map((lang) => {
                        return (
                            <SelectItem
                                key={lang.code}
                                value={lang.code}
                                className="hover:cursor-pointer"
                            >
                                {lang.label}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        </>
    )
}