import { usePreferences, type TranslationMode } from "@/stores/preferences.store";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function TranslationModeToggle() {
    const { translationMode, setTranslationMode } = usePreferences();
    const { t } = useTranslation();

    const toggle = () => {
        const next: TranslationMode = translationMode === "manual" ? "zh_en_auto" : "manual";
        setTranslationMode(next);
    };

    return (
        <button
            onClick={toggle}
            className={cn(
                "text-sm flex items-center gap-1 border px-2 py-0.5 w-fit rounded-lg hover:cursor-pointer",
                "hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242] text-muted-foreground border-none",
                translationMode === "zh_en_auto" && "bg-[#ececec] dark:bg-[#424242]"
            )}
            title={translationMode === "manual" ? t("common.frame.mode.switch_to_auto") : t("common.frame.mode.switch_to_manual")}
        >
            {translationMode === "manual" ? (
                <>
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("common.frame.mode.auto")}</span>
                </>
            ) : (
                <>
                    <Languages className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("common.frame.mode.manual")}</span>
                </>
            )}
        </button>
    );
}
