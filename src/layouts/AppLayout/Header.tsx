import GithubLink from "@/components/common/GithubLink";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b dark:border-b-white bg-[#FBFBFB] dark:bg-[#0B0B0C] text-gray-900 dark:text-gray-100 ">
      <nav className="max-w-7xl mx-auto flex h-10 justify-between items-center">

        <Link to={"/"} className="flex items-center gap-2">
          <img src="/x.svg" alt="logo" className="w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight">Poixe Translate</span>
        </Link>

        <div className="flex gap-2">
          <div>选择语言</div>

          <ThemeSwitcher />
          
          <GithubLink />
        </div>
      </nav>
    </header>
  );
}
