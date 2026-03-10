import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/stores/preferences.store";
import { ChevronDown, ChevronUp, SearchIcon } from 'lucide-react';
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PromptSelectorDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");

    const { prompts } = usePrompts();
    const { selectedPromptId, setSelectedPromptId } = usePreferences();

    const filteredPrompts = useMemo(() => {
        const list = prompts ?? [];
        const q = keyword.trim().toLowerCase();

        if (!q) return list;

        return list.filter((item) => {
            return (
                item.name.toLowerCase().includes(q) ||
                item.content.toLowerCase().includes(q)
            );
        });
    }, [prompts, keyword]);

    const selectedPromptLabel = useMemo(() => {
        if (!selectedPromptId) {
            return t("common.preferences.select_prompt.dialog_trigger");
        }

        const found = prompts?.find((p) => p.id === selectedPromptId);
        return found?.name ?? t("common.preferences.select_prompt.dialog_trigger");
    }, [selectedPromptId, prompts, t]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <button
                        className={cn(
                            "text-sm flex items-center gap-3 border px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242] text-muted-foreground border-none",
                            "max-w-40 min-w-0",
                            open && "bg-[#ececec] dark:bg-[#424242]"
                        )}
                    >
                        <span className="flex-1 min-w-0 truncate text-left">
                            {selectedPromptLabel}
                        </span>
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="w-[90vw] h-[80vh] sm:max-w-120 sm:max-h-140 p-0 dark:bg-[#212121]"
                >
                    {/* 无障碍标准 */}
                    <DialogTitle className="sr-only">{t("common.preferences.select_prompt.dialog_title")}</DialogTitle>
                    <DialogDescription className="sr-only">{t("common.preferences.select_prompt.dialog_description")}</DialogDescription>

                    {/* 正式内容 */}
                    <div className="flex flex-col py-2 min-h-0 overflow-hidden">
                        {/* 顶部搜索 */}
                        <div className="border-b px-4 pt-2 pb-3 flex flex-row items-center gap-2">
                            <SearchIcon className="w-5 h-5 text-muted-foreground" />
                            <input
                                placeholder={t("common.preferences.select_prompt.search")}
                                className="flex-1 border-0 outline-none text-sm"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        {/* Prompt 列表 */}
                        <div className="flex-1 overflow-y-auto px-2 py-2">
                            <div className="flex flex-col gap-2">
                                {filteredPrompts.map((item) => {
                                    const selected = item.id === selectedPromptId;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                if (item.id == null) return;
                                                setSelectedPromptId(item.id);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "relative rounded-md px-3 py-3",
                                                "hover:bg-[#ececec] hover:cursor-pointer dark:hover:bg-[#353535]",
                                                selected &&
                                                "bg-[#ececec] dark:bg-[#353535] before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.75 before:rounded-full before:bg-gray-300"
                                            )}
                                        >
                                            <div className={cn("flex flex-col gap-1 min-w-0", selected && "pl-1")}>
                                                <div className="text-sm font-medium truncate wrap-break-words">
                                                    {item.name}
                                                </div>

                                                <div className="text-xs text-muted-foreground line-clamp-2 overflow-hidden whitespace-pre-wrap warp-break-words">
                                                    {item.content.replace(/\n/g, " ")}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}