import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, SearchIcon, Pin, PinOff } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import { OpenAI } from '@lobehub/icons';
import { useProviders } from "@/hooks/useProviders";
import { usePinnedModels } from "@/stores/pinned.models.store";

export default function ModelSelectorDialog() {
    const [open, setOpen] = useState(false);

    const { providers } = useProviders();
    // providers -> groups
    const groups = useMemo(() => {
        if (!providers) return [];
        return providers
            .map((p) => {
                const models = (p.models ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                return { provider: p, models };
            })
            .filter((g) => g.models.length > 0);
    }, [providers]);

    const { pinned, isPinned, toggle, removeMany } = usePinnedModels();
    // 当前 dexie 数据能生成的所有合法 key
    const validKeySet = useMemo(() => {
        const set = new Set<string>();
        for (const g of groups) {
            const pid = g.provider.id;
            if (pid == null) continue;
            for (const m of g.models) set.add(`${pid}:${m}`)
        }
        return set;
    }, [groups])

    // dexie 变更时：自动移除已经不存在的置顶项
    useEffect(() => {
        // providers 还没加载出来，不做清理
        if (providers === undefined) return;
        if (!pinned.length) return;

        const invalid = pinned.filter((k) => !validKeySet.has(k));

        if (invalid.length) removeMany(invalid);
    }, [providers, pinned, validKeySet, removeMany]);

    // 计算置顶列表
    const pinnedItems = useMemo(() => {
        // 方便从 key 反查显示内容
        const map = new Map<string, { providerId: number; providerName: string; model: string }>();

        for (const g of groups) {
            const pid = g.provider.id;
            if (pid == null) continue;
            for (const model of g.models) {
                const key = `${pid}:${model}`;
                map.set(key, { providerId: pid, providerName: g.provider.name, model })
            }
        }

        return pinned
            .map((k) => map.get(k))
            .filter(Boolean) as Array<{ providerId: number; providerName: string; model: string }>;
    }, [groups, pinned])

    // 用于“原分组区”的展示：把已置顶的模型隐藏掉
    const visibleGroup = useMemo(() => {
        return groups
            .map((g) => {
                const pid = g.provider.id;
                if (pid == null) return g;

                const models = g.models.filter((model) => {
                    const key = `${pid}:${model}`;
                    return !pinned.includes(key);
                });

                return { ...g, models };
            })
            .filter((g) => g.models.length > 0);
    }, [groups, pinned])

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
                        选择模型
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="w-[90vw] h-[80vh] sm:max-w-120 sm:max-h-140 p-0"
                >
                    {/* 无障碍标准 */}
                    <DialogTitle className="sr-only">选择模型</DialogTitle>
                    <DialogDescription className="sr-only">选择用于翻译的 AI 模型</DialogDescription>

                    {/* 正式内容 */}
                    <div className="flex flex-col py-2 min-h-0 overflow-hidden">
                        {/* 顶部搜索 */}
                        <div className="border-b px-4 pt-2 pb-3 flex flex-row items-center gap-2">
                            <SearchIcon className="w-5 h-5 text-muted-foreground" />
                            <input
                                placeholder="搜索模型..."
                                className="flex-1 border-0 outline-none text-sm"
                            />
                        </div>

                        {/* 模型列表 */}
                        <div className="flex-1 px-2 py-2 pr-3 overflow-y-auto flex flex-col gap-4">
                            {/* 置顶分组 */}
                            {pinnedItems.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="text-muted-foreground px-1 text-xs">
                                        置顶
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {pinnedItems.map((item) => {
                                            const key = `${item.providerId}:${item.model}`;
                                            return (
                                                <div
                                                    key={key}
                                                    className="relative flex flex-row justify-between items-center rounded-md text-sm
                                                        before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.75 before:rounded-full before:bg-gray-300
                                                        hover:bg-[#ececec] hover:cursor-pointer"
                                                >
                                                    {/* 左侧 */}
                                                    <div className="pl-1 flex flex-row items-center gap-2 mx-2 py-2" >
                                                        <OpenAI className="w-4 h-4" />
                                                        <span>{item.model}</span>
                                                        <span className="text-muted-foreground">{item.providerName}</span>
                                                    </div>

                                                    {/* 右侧 */}
                                                    <div className="flex items-center justify-center mr-2">
                                                        {/* 置顶里点一下就是取消置顶 */}
                                                        <PinOff
                                                            className="w-4 h-4 hover:cursor-pointer text-muted-foreground hover:text-foreground"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggle(key);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* map 分组 */}
                            {visibleGroup.map(({ provider, models }) => (
                                <div
                                    key={provider.id}
                                    className="flex flex-col gap-2"
                                >
                                    {/* 分组标题：provider 名称 */}
                                    <div className="text-muted-foreground px-1 text-xs">
                                        {provider.name}
                                    </div>

                                    {/* 分组内模型列表 */}
                                    <div className="flex flex-col gap-2">
                                        {models.map((model) => (
                                            <div
                                                key={`${provider.id ?? provider.name}:${model}`}
                                                className="relative flex flex-row justify-between items-center rounded-md text-sm
                                                    before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.75 before:rounded-full before:bg-gray-300
                                                    hover:bg-[#ececec] hover:cursor-pointer"
                                            >
                                                {/* 左侧 */}
                                                <div className="pl-1 flex flex-row items-center gap-2 mx-2 py-2" >
                                                    <OpenAI className="w-4 h-4" />
                                                    <span>{model}</span>
                                                    <span className="text-muted-foreground">{provider.name}</span>
                                                </div>

                                                {/* 右侧 */}
                                                <div className="flex items-center justify-center mr-2">
                                                    {(() => {
                                                        const pid = provider.id;
                                                        const key = pid == null ? "" : `${pid}:${model}`;
                                                        const pinnedNow = pid != null && isPinned(key);

                                                        const Icon = pinnedNow ? PinOff : Pin;

                                                        return (
                                                            <Icon
                                                                className="w-4 h-4 hover:cursor-pointer text-muted-foreground hover:text-foreground"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (pid == null) return;
                                                                    toggle(key);
                                                                }}
                                                            />
                                                        )
                                                    })()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}