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