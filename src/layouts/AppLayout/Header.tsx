import GithubLink from "@/components/common/GithubLink";
import { Link } from "react-router-dom";
import VerticalDivider from "@/components/common/VerticalDivider";
import { SettingsDialog } from "@/features/settings";
import { useAuth } from "@/stores/auth.store";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="w-full border-b dark:border-b-white bg-[#FBFBFB] dark:bg-[#0B0B0C] text-gray-900 dark:text-gray-100 ">
      <nav className="max-w-7xl mx-auto flex h-10 justify-between items-center px-2">

        <Link to={"/"} className="flex items-center gap-2">
          <img src="/x.svg" alt="logo" className="w-6 h-6" />
          <span className="hidden sm:inline text-xl font-semibold tracking-tight">Poixe Translate</span>
        </Link>

        <div className="flex gap-2 items-center">
          <GithubLink />
          
          <VerticalDivider />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {user.display_name?.[0] || user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user.display_name || user.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium border-b">
                  <div>{user.display_name || user.username}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
                <DropdownMenuItem asChild>
                  <SettingsDialog />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('common.button.sign_out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
