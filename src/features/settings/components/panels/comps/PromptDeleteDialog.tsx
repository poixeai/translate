import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { TranslationPrompt } from "@/types/prompts";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    prompt?: TranslationPrompt | null;
    onConform: (id: number) => Promise<void>;
};

export default function PromptDeleteDialog({
    open,
    onOpenChange,
    prompt,
    onConform,
}: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const display = useMemo(() => {
        if (!prompt) return "";
        const name = prompt.name ?? "";
        return name;
    }, [prompt]);

    const handleDelete = async () => {
        if (prompt?.id == null) return;

        try {
            setLoading(true);
            await onConform(prompt.id);
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(v) => !loading && onOpenChange(v)}
            >
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-100 p-0"
                >
                    <DialogTitle className="sr-only">{t('common.settings.prompts.delete.title')}</DialogTitle>

                    <div className="p-6 space-y-5">
                        <div className="space-y-1">
                            <div className="text-lg">
                                {t('common.settings.prompts.delete.title')}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t('common.settings.prompts.delete.content')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">{t('common.settings.prompts.delete.confirm')}</div>
                            <Input value={display} readOnly className="h-11" />
                        </div>

                        <div className="flex justify-end gap-3 pt-1">
                            <Button
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                                className="hover:cursor-pointer"
                            >
                                {t('common.button.cancel')}
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="hover:cursor-pointer"
                            >
                                {loading ? t('common.button.deleting') : t('common.button.delete')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}