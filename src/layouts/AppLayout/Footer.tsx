import { Kbd } from "@/components/ui/kbd";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className="w-full border-t dark:border-t-white text-muted-foreground dark:text-white bg-[#FBFBFB] dark:bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center px-2">
        <span className="text-xs">© {new Date().getFullYear()} Poixe Translate</span>

        <div className="hidden sm:flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <span>+</span>
              <Kbd>Enter</Kbd>
            </div>
            <span>{t("common.frame.footer.shortcuts.translate")}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Kbd>Esc</Kbd>
              <Kbd>Esc</Kbd>
            </div>
            <span>{t("common.frame.footer.shortcuts.clear")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
