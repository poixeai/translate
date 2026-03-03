import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateProviderInput, UpdateProviderPatch } from "@/hooks/useProviders";
import { API_STYLES_OPTIONS, type APIStyle, type ModelProvider } from "@/types/providers";
import { useEffect, useMemo, useState } from "react";
import { normalizeAndDedupeModels } from "@/utils/models";
import { useTranslation } from "react-i18next";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;

    initial?: ModelProvider | null;

    onCreate: (data: CreateProviderInput) => Promise<void>;
    onUpdate: (id: number, patch: UpdateProviderPatch) => Promise<void>;
};

export default function ProviderUpsertDialog({
    open,
    onOpenChange,
    initial,
    onCreate,
    onUpdate,
}: Props) {
    const { t } = useTranslation();
    const isEdit = !!initial?.id;

    const [name, setName] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [apiStyle, setApiStyle] = useState<APIStyle>("openai_completions");
    const [models, setModels] = useState("");

    // 打开编辑时，把数据灌进去；新增时清空
    useEffect(() => {
        if (!open) return;

        if (initial) {
            setName(initial.name ?? "");
            setBaseUrl(initial.base_url ?? "");
            setApiKey(initial.api_key ?? "");
            setApiStyle(initial.api_style ?? "openai_completions");
            setModels((initial.models ?? "").split(",").join("\n")); // 展示时换成多行更好编辑
        } else {
            setName("");
            setBaseUrl("");
            setApiKey("");
            setApiStyle("openai_completions");
            setModels("");
        }
    }, [open, initial])

    const canSubmit = useMemo(() => {
        return !!(name.trim() && baseUrl.trim() && apiKey.trim() && models.trim());
    }, [name, baseUrl, apiKey, apiStyle, models])

    const modelsInfo = useMemo(() => normalizeAndDedupeModels(models), [models]);

    const handleSubmit = async () => {
        if (!canSubmit) return;

        const payload = {
            name: name.trim(),
            base_url: baseUrl.trim(),
            api_key: apiKey.trim(),
            api_style: apiStyle,
            models: modelsInfo.csv,
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
                    {isEdit ? t('common.settings.providers.dialog.title_edit') : t('common.settings.providers.dialog.title_create')}
                </DialogTitle>

                {/* 正式内容 */}
                <div className="flex flex-col gap-3 justify-between py-3 min-w-0 overflow-hidden">
                    {/* header */}
                    <div className="text-lg px-3">
                        {isEdit ? t('common.settings.providers.dialog.title_edit') : t('common.settings.providers.dialog.title_create')}
                    </div>

                    {/* sheet */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-3 py-2">
                        {/* <PageFiller /> */}
                        <div className="grid gap-2">
                            <Label>{t('common.settings.providers.dialog.name')}</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="OpenAI" />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('common.settings.providers.dialog.api_url')}</Label>
                            <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.openai.com" />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('common.settings.providers.dialog.api_key')}</Label>
                            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('common.settings.providers.dialog.api_style')}</Label>
                            <Select value={apiStyle} onValueChange={(v) => setApiStyle(v as APIStyle)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.settings.providers.dialog.select_placeholder')} />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {API_STYLES_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span>{opt.label}</span>
                                            <span className="text-xs text-muted-foreground">{opt.url}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('common.settings.providers.dialog.models')}</Label>
                            <Textarea value={models} onChange={(e) => setModels(e.target.value)} placeholder={"gpt-4o\ngpt-5.2"} />
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