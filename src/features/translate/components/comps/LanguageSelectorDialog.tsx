import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, SearchIcon } from 'lucide-react';
import { useMemo, useState } from "react";
import { usePreferences } from "@/stores/preferences.store";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/constants/languages";

export default function LanguageSelectorDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const { targetLanguage, setTargetLanguage } = usePreferences();

    // 把语言列表按翻译后的名称排序
    const sortedLanguages = useMemo(() => {
        return [...LANGUAGES]
            .map((lang) => ({
                ...lang,
                label: t(lang.i18nKey, { defaultValue: lang.nativeName }),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [t]);

    // 搜索过滤
    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return sortedLanguages;
        return sortedLanguages.filter((lang) => {
            // 1. 当前 UI 语言下的显示名
            if (lang.label.toLowerCase().includes(q)) return true;
            // 2. 语言代码
            if (lang.code.toLowerCase().includes(q)) return true;
            // 3. 所有搜索关键词（跨语言）
            if (lang.searchTerms.some((term) => term.toLowerCase().includes(q))) return true;
            return false;
        });
    }, [sortedLanguages, keyword]);

    // 两列布局：拆成左右两列
    const leftCol = useMemo(() => filtered.filter((_, i) => i % 2 === 0), [filtered]);
    const rightCol = useMemo(() => filtered.filter((_, i) => i % 2 === 1), [filtered]);

    // 当前选中的显示文字
    const selectedLabel = useMemo(() => {
        const found = LANGUAGES.find((l) => l.code === targetLanguage);
        return found
            ? t(found.i18nKey, { defaultValue: found.nativeName })
            : t("common.preferences.select_language.dialog_trigger");
    }, [targetLanguage, t]);

    const renderItem = (lang: { code: string; i18nKey: string; nativeName: string; searchTerms: string[]; label: string }) => {
        const selected = lang.code === targetLanguage;
        return (
            <div
                key={lang.code}
                onClick={() => {
                    setTargetLanguage(lang.code);
                    setOpen(false);
                }}
                className={cn(
                    "relative flex items-center rounded-md px-3 py-2 text-sm",
                    "hover:bg-[#ececec] hover:cursor-pointer dark:hover:bg-[#353535]",
                    selected &&
                    "bg-[#ececec] dark:bg-[#353535] before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.75 before:rounded-full before:bg-gray-300"
                )}
            >
                <span className={cn(selected && "pl-1")}>{lang.label}</span>
            </div>
        );
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <button
                        className={cn(
                            "text-sm flex items-center gap-3 border px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242] text-muted-foreground border-none",
                            open && "bg-[#ececec] dark:bg-[#424242]"
                        )}
                    >
                        <span>{selectedLabel}</span>
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="w-[90vw] h-[80vh] sm:max-w-120 sm:max-h-140 p-0 dark:bg-[#212121]"
                >
                    {/* 无障碍标准 */}
                    <DialogTitle className="sr-only">{t("common.preferences.select_language.dialog_title")}</DialogTitle>
                    <DialogDescription className="sr-only">{t("common.preferences.select_language.dialog_description")}</DialogDescription>

                    {/* 正式内容 */}
                    <div className="flex flex-col py-2 min-h-0 overflow-hidden">
                        {/* 顶部搜索 */}
                        <div className="border-b px-4 pt-2 pb-3 flex flex-row items-center gap-2">
                            <SearchIcon className="w-5 h-5 text-muted-foreground" />
                            <input
                                placeholder={t("common.preferences.select_language.search")}
                                className="flex-1 border-0 outline-none text-sm"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        {/* 两列语言列表 */}
                        <div className="flex-1 overflow-y-auto px-2 py-2">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {/* 左列 */}
                                <div className="flex flex-col gap-1">
                                    {leftCol.map(renderItem)}
                                </div>
                                {/* 右列 */}
                                <div className="flex flex-col gap-1">
                                    {rightCol.map(renderItem)}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}