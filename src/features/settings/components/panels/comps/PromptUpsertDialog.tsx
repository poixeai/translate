import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TranslationPrompt } from "@/types/prompts";
import type { CreatePromptInput, UpdatePromptPatch } from "@/hooks/usePrompts";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;

    initial?: TranslationPrompt | null;

    onCreate: (data: CreatePromptInput) => Promise<void>;
    onUpdate: (id: number, patch: UpdatePromptPatch) => Promise<void>;
};

export default function PromptUpsertDialog({
    open,
    onOpenChange,
    initial,
    onCreate,
    onUpdate,
}: Props) {
    const { t } = useTranslation();
    const isEdit = !!initial?.id;

    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    // 打开编辑时，把数据灌进去；新增时清空
    useEffect(() => {
        if (!open) return;

        if (initial) {
            setName(initial.name ?? "");
            setContent(initial.content ?? "");
        } else {
            setName("");
            setContent("");
        }
    }, [open, initial])

    const canSubmit = useMemo(() => {
        return !!(name.trim() && content.trim());
    }, [name, content])

    const handleSubmit = async () => {
        if (!canSubmit) return;

        const payload = {
            name: name.trim(),
            content: content.trim(),
        }

        if (isEdit && initial?.id) {
            // 编辑：update 用 patch 也行，这里直接传全量字段更直观
            await onUpdate(initial.id, payload);
        } else {
            await onCreate(payload);
        }

        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                showCloseButton={false}
                className="w-[90vw] h-[80vh] sm:max-w-120 sm:max-h-140 p-0"
            >
                {/* 无障碍标准 */}
                <DialogTitle className="sr-only">
                    {isEdit ? t('common.settings.prompts.dialog.title_edit') : t('common.settings.prompts.dialog.title_create')}
                </DialogTitle>

                {/* 正式内容 */}
                <div className="flex flex-col gap-3 justify-between py-3 min-w-0 overflow-hidden">
                    {/* header */}
                    <div className="text-lg px-3">
                        {isEdit ? t('common.settings.prompts.dialog.title_edit') : t('common.settings.prompts.dialog.title_create')}
                    </div>

                    {/* sheet */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-3 py-2">
                        {/* <PageFiller /> */}
                        <div className="grid gap-2">
                            <Label>{t('common.settings.prompts.dialog.name')}</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('common.settings.prompts.dialog.name_placeholder')} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('common.settings.prompts.dialog.content')}</Label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t('common.settings.prompts.dialog.content_placeholder')}
                            />
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex gap-2 justify-end px-3">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common.button.cancel')}
                        </Button>

                        <Button
                            className="hover:cursor-pointer"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                        >
                            {isEdit ? t('common.button.save') : t('common.button.create')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}