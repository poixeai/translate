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
import { Button } from "../ui/button";
import PageFiller from "../dev/PageFiller";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const SIDEBAR = [
    { key: "general", icon: Settings, label: "常规" },
    { key: "provider", icon: Box, label: "模型厂商" },
    { key: "prompt", icon: BookOpenText, label: "提示词" },
    { key: "about", icon: Info, label: "关于" },
] as const;

type PanelKey = typeof SIDEBAR[number]["key"];

export default function SettingsDialog() {
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState<PanelKey>("general");

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
                    <div className="flex w-full h-full min-h-0">
                        {/* 左侧侧边栏 */}
                        <div className="w-45 bg-[#f9f9f9] p-1">
                            {/* 侧边栏 顶部关闭按钮 */}
                            <div className="h-10 flex items-center">
                                <DialogClose asChild>
                                    <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </DialogClose>
                            </div>

                            {/* 侧边栏 导航列表 */}
                            <div className="text-sm">
                                {SIDEBAR.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setPanel(item.key)}
                                        className={cn(
                                            "w-full hover:cursor-pointer h-9 flex items-center gap-3 px-2 rounded-md hover:bg-[#efefef]",
                                            panel === item.key && "bg-[#efefef]"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 右侧内容区 */}
                        <div className="flex-1 py-1 px-2 flex flex-col min-h-0">
                            {/* 右侧内容 顶部标题 */}
                            <div className="h-10 flex items-center my-2">
                                {SIDEBAR.find(s => s.key === panel)?.label}
                            </div>

                            <Separator />

                            {/* 右侧内容 中心内容 */}
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <PageFiller />
                            </div>
                        </div>
                    </div>
                </DialogContent>

            </Dialog>
        </>
    )
}