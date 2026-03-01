import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ThemeSelector from "@/components/common/ThemeSelector";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "react-i18next";

export default function GeneralPanel() {

    const { t } = useTranslation();

    return (
        <>
            <div className="h-15 flex justify-between items-center">
                <span>{t("common.settings.general.appearance")}</span>
                <ThemeSelector />
            </div>
            <Separator className="bg-border/60" />

            <div className="h-15 flex justify-between items-center">
                <span>{t("common.settings.general.language")}</span>
                <LanguageSelector />
            </div>
            <Separator className="bg-border/60" />
        </>
    )
}