import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Settings, Box, BookOpenText, Info, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import GeneralPanel from "./panels/GeneralPanel";
import { useTranslation } from "react-i18next";
import AboutPanel from "./panels/AboutPanel";
import PromptPanel from "./panels/PromptPanel";
import ProviderPanel from "./panels/ProviderPanel";

const SIDEBAR = [
    { key: "general", icon: Settings, labelKey: "common.settings.sidebar.general" },
    { key: "providers", icon: Box, labelKey: "common.settings.sidebar.providers" },
    { key: "prompts", icon: BookOpenText, labelKey: "common.settings.sidebar.prompts" },
    { key: "about", icon: Info, labelKey: "common.settings.sidebar.about" },
] as const;

type PanelKey = typeof SIDEBAR[number]["key"];

export function SettingsDialog() {
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState<PanelKey>("general");
    const { t } = useTranslation();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Settings" className="hover:cursor-pointer">
                        <Settings className="w-4 h-4" />
                    </Button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="w-[95vw] h-[90vh] sm:max-w-170 sm:max-h-150 p-0"
                >
                    {/* 无障碍标准 */}
                    <DialogTitle className="sr-only">设置面板</DialogTitle>
                    <DialogDescription className="sr-only">调整应用偏好设置</DialogDescription>

                    {/* 正式内容 */}
                    <div className="flex flex-col sm:flex-row w-full h-full min-h-0 min-w-0 overflow-hidden">
                        {/* 侧边栏 */}
                        <div className="shrink-0 w-full sm:w-45 bg-[#f9f9f9] dark:bg-[#1e1e1e] sm:p-1 sm:rounded-l-lg rounded-t-lg sm:rounded-t-none">
                            {/* 侧边栏 顶部关闭按钮 */}
                            <div className="h-10 flex items-center justify-end sm:justify-start dark:bg-[#212121] sm:dark:bg-[#1e1e1e]">
                                <DialogClose asChild>
                                    <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </DialogClose>
                            </div>

                            {/* 侧边栏 导航列表 */}
                            <div className="text-sm flex flex-row gap-1 sm:gap-0 sm:flex-col p-1 sm:p-0 overflow-x-auto">
                                {SIDEBAR.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setPanel(item.key)}
                                        className={cn(
                                            "flex-none sm:w-full hover:cursor-pointer h-9 flex items-center gap-3 px-2 rounded-md hover:bg-[#efefef] dark:hover:bg-[#353535]",
                                            panel === item.key && "bg-[#efefef] dark:bg-[#353535]"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{t(item.labelKey)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 内容区 */}
                        <div className="flex-1 py-1 px-2 flex flex-col min-h-0 min-w-0 dark:bg-[#212121]">
                            {/* 内容区 顶部标题 */}
                            <div className="h-10 hidden sm:flex items-center my-2">
                                {t(SIDEBAR.find(s => s.key === panel)?.labelKey || "")}
                            </div>

                            <Separator />

                            {/* 内容区 中心内容 */}
                            <div className="flex-1 overflow-y-auto min-h-0 text-sm">
                                {panel === "general" && <GeneralPanel />}

                                {panel === "providers" && <ProviderPanel />}

                                {panel === "prompts" && <PromptPanel />}

                                {panel === "about" && <AboutPanel />}
                            </div>
                        </div>
                    </div>
                </DialogContent>

            </Dialog>
        </>
    )
}