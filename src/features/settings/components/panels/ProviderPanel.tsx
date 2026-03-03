import { Plus, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useProviders } from "@/hooks/useProviders";
import { useState } from "react";
import { getAPIStyleLabel, type ModelProvider } from "@/types/providers";
import ProviderUpsertDialog from "./comps/ProviderUpsertDialog";
import { normalizeAndDedupeModels } from "@/utils/models";
import ProviderDeleteDialog from "./comps/ProviderDeleteDialog";
import { useTranslation } from "react-i18next";

export default function ProviderPanel() {
    const { t } = useTranslation();
    const { providers, create, update, remove } = useProviders();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ModelProvider | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState<ModelProvider | null>(null);

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (p: ModelProvider) => {
        setEditing(p);
        setOpen(true);
    }

    const openDelete = (p: ModelProvider) => {
        setDeleting(p);
        setDeleteOpen(true);
    }

    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                {/* 顶部 */}
                <div>{t('common.settings.providers.header')}</div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-1 border px-2 py-1 w-fit rounded-xl hover:cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242]"
                >
                    <Plus className="w-4 h-4" />
                    {t('common.settings.providers.add_button')}
                </button>

                {/* 内容 */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25">{t('common.settings.providers.sheet.name')}</TableHead>
                                <TableHead>{t('common.settings.providers.sheet.api_style')}</TableHead>
                                <TableHead>{t('common.settings.providers.sheet.model_count')}</TableHead>
                                <TableHead className="text-right w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!providers ? (
                                <TableCell colSpan={4} className="text-muted-foreground">
                                    Loading...
                                </TableCell>
                            ) : providers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground">
                                        No providers available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                providers.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{getAPIStyleLabel(p.api_style)}</TableCell>
                                        <TableCell>
                                            {normalizeAndDedupeModels(p.models ?? "").count}
                                        </TableCell>
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

                <ProviderUpsertDialog
                    open={open}
                    onOpenChange={setOpen}
                    initial={editing}
                    onCreate={create}
                    onUpdate={update}
                />

                <ProviderDeleteDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    provider={deleting}
                    onConform={async (id) => {
                        await remove(id);
                        setDeleting(null);
                    }}
                />
            </div>
        </>
    )
}