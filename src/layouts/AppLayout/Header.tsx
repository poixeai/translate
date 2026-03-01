import GithubLink from "@/components/common/GithubLink";
import { Link } from "react-router-dom";
import VerticalDivider from "@/components/common/VerticalDivider";
import DemoSettingsDialog from "@/components/common/DemoSettingsDialog";
import { SettingsDialog } from "@/features/settings";

export default function Header() {
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

          <SettingsDialog />
          <DemoSettingsDialog />
        </div>
      </nav>
    </div>
  );
}
