import { Plus, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePrompts } from "@/hooks/usePrompts";
import type { TranslationPrompt } from "@/types/prompts";
import PromptUpsertDialog from "./comps/PromptUpsertDialog";
import PromptDeleteDialog from "./comps/PromptDeleteDialog";

export default function PromptPanel() {
    const { t } = useTranslation();
    const { prompts, create, update, remove } = usePrompts();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<TranslationPrompt | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState<TranslationPrompt | null>(null);

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (p: TranslationPrompt) => {
        setEditing(p);
        setOpen(true);
    }

    const openDelete = (p: TranslationPrompt) => {
        setDeleting(p);
        setDeleteOpen(true);
    }

    return (
        <>
            <>
                <div className="flex flex-col gap-2 pt-2">
                    <div>{t('common.settings.prompts.header')}</div>

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-1 border px-2 py-1 w-fit rounded-xl hover:cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242]"
                    >
                        <Plus className="w-4 h-4" />
                        {t('common.settings.prompts.add_button')}
                    </button>

                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-25">{t('common.settings.prompts.sheet.name')}</TableHead>
                                    <TableHead>{t('common.settings.prompts.sheet.content')}</TableHead>
                                    <TableHead className="text-right w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!prompts ? (
                                    <p>{t("common.status.loading")}</p>
                                ) : prompts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground">
                                            {t("common.status.no_prompts")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    prompts.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium max-w-50 truncate">{p.name}</TableCell>
                                            <TableCell className="max-w-50 truncate text-muted-foreground">{p.content}</TableCell>
                                            <TableCell className="text-right">
                                                <button
                                                    className="hover:cursor-pointer p-1.5 hover:bg-[#ececec] rounded-sm dark:hover:bg-[#424242]"
                                                    onClick={() => openEdit(p)}
                                                >
                                                    <SquarePen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="hover:cursor-pointer p-1.5 hover:bg-[#ececec] rounded-sm dark:hover:bg-[#424242] text-red-500 hover:text-red-500"
                                                    onClick={() => openDelete(p)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <PromptUpsertDialog
                        open={open}
                        onOpenChange={setOpen}
                        initial={editing}
                        onCreate={create}
                        onUpdate={update}
                    />

                    <PromptDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        prompt={deleting}
                        onConform={async (id) => {
                            await remove(id);
                            setDeleting(null);
                        }}
                    />
                </div>
            </>
        </>
    )
}