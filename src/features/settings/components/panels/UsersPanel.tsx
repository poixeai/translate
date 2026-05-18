import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/stores/auth.store";
import { useTranslation } from "react-i18next";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogTitle, DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type User = {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  display_name: string;
  email: string;
  created_at: number;
};

export function UsersPanel() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"ADMIN" | "USER">("USER");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    api.listUsers().then(data => {
      setUsers(data.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [open]);

  const openCreate = () => {
    setEditing(null);
    setFormUsername("");
    setFormPassword("");
    setFormRole("USER");
    setFormDisplayName("");
    setFormEmail("");
    setOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setFormUsername(user.username);
    setFormPassword("");
    setFormRole(user.role);
    setFormDisplayName(user.display_name);
    setFormEmail(user.email);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      await api.updateUser(editing.id, {
        role: formRole,
        display_name: formDisplayName,
        email: formEmail,
      });
      if (formPassword) {
        await api.changeUserPassword(editing.id, formPassword);
      }
    } else {
      await api.createUser({
        username: formUsername,
        password: formPassword,
        role: formRole,
        display_name: formDisplayName,
        email: formEmail,
      });
    }
    setOpen(false);
    api.listUsers().then(data => setUsers(data.users || []));
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await api.deleteUser(deleting.id);
    setDeleteOpen(false);
    setUsers(users.filter(u => u.id !== deleting.id));
  };

  return (
    <div className="flex flex-col gap-2 pt-2">
      <div>{t('common.settings.users.header')}</div>
      <Button onClick={openCreate} variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-1" />
        {t('common.settings.users.add_button')}
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.settings.users.sheet.username')}</TableHead>
            <TableHead>{t('common.settings.users.sheet.role')}</TableHead>
            <TableHead>{t('common.settings.users.sheet.display_name')}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={4}>{t('common.status.loading')}</TableCell></TableRow>
          ) : users.length === 0 ? (
            <TableRow><TableCell colSpan={4}>{t('common.status.no_users')}</TableCell></TableRow>
          ) : users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <span className={cn("text-xs px-2 py-0.5 rounded", user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700")}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell>{user.display_name || "-"}</TableCell>
              <TableCell className="text-right">
                <button onClick={() => openEdit(user)} className="p-1.5 hover:bg-gray-100 rounded">
                  <SquarePen className="w-4 h-4" />
                </button>
                {user.id !== currentUser?.id && (
                  <button onClick={() => { setDeleting(user); setDeleteOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editing ? t('common.settings.users.dialog.title_edit') : t('common.settings.users.dialog.title_create')}</DialogTitle>
          <div className="flex flex-col gap-3">
            <div>
              <Label>{t('common.settings.users.dialog.username')}</Label>
              <Input value={formUsername} onChange={e => setFormUsername(e.target.value)} disabled={!!editing} />
            </div>
            <div>
              <Label>{t('common.settings.users.dialog.password')}</Label>
              <Input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder={editing ? t('common.settings.users.dialog.password_optional') : ""} />
            </div>
            <div>
              <Label>{t('common.settings.users.dialog.role')}</Label>
              <select value={formRole} onChange={e => setFormRole(e.target.value as "ADMIN" | "USER")} className="w-full border rounded px-2 py-1">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <Label>{t('common.settings.users.dialog.display_name')}</Label>
              <Input value={formDisplayName} onChange={e => setFormDisplayName(e.target.value)} />
            </div>
            <div>
              <Label>{t('common.settings.users.dialog.email')}</Label>
              <Input value={formEmail} onChange={e => setFormEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild><Button variant="outline">{t('common.button.cancel')}</Button></DialogClose>
            <Button onClick={handleSubmit}>{t('common.button.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogTitle>{t('common.settings.users.dialog.delete_title')}</DialogTitle>
          <p>{t('common.settings.users.dialog.delete_confirm', { username: deleting?.username })}</p>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild><Button variant="outline">{t('common.button.cancel')}</Button></DialogClose>
            <Button variant="destructive" onClick={handleDelete}>{t('common.button.delete')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
