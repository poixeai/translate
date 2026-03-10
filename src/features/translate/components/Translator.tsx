import { useTranslation } from 'react-i18next';
import ModelSelectorDialog from './comps/ModelSelectorDialog';
import { usePreferences } from '@/stores/preferences.store';
import { useEffect, useRef } from 'react';
import { Share2 } from 'lucide-react';
import LanguageSelectorDialog from './comps/LanguageSelectorDialog';
import PromptSelectorDialog from './comps/PromptSelectorDialog';

export function Translator() {
    const { t } = useTranslation();

    const { sourceText, setSourceText, translatedText, setTranslatedText } = usePreferences();

    const inputTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const outputTextareaRef = useRef<HTMLTextAreaElement | null>(null);

    const translateButtonRef = useRef<HTMLButtonElement | null>(null);
    const lastEscTimeRef = useRef(0);

    const syncBothTextareaHeights = () => {
        const inputEl = inputTextareaRef.current;
        const outputEl = outputTextareaRef.current;

        if (!inputEl || !outputEl) return;

        const minHeight = 300;
        const bottomGap = 100;

        // 先都设成 auto，拿到真实 scrollHeight
        inputEl.style.height = "auto";
        outputEl.style.height = "auto";

        // 用左侧 textarea 的 top 来算可用高度就够了
        // 因为你左右结构基本是对齐的
        const rect = inputEl.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - bottomGap;
        const dynamicMaxHeight = Math.max(minHeight, availableHeight);

        const inputNeededHeight = Math.max(inputEl.scrollHeight, minHeight);
        const outputNeededHeight = Math.max(outputEl.scrollHeight, minHeight);

        const sharedHeight = Math.min(
            Math.max(inputNeededHeight, outputNeededHeight),
            dynamicMaxHeight
        );

        inputEl.style.height = `${sharedHeight}px`;
        outputEl.style.height = `${sharedHeight}px`;

        inputEl.style.overflowY = inputEl.scrollHeight > sharedHeight ? "auto" : "hidden";
        outputEl.style.overflowY = outputEl.scrollHeight > sharedHeight ? "auto" : "hidden";
    };

    useEffect(() => {
        syncBothTextareaHeights();
    }, [sourceText, translatedText]);

    useEffect(() => {
        const handleResize = () => {
            syncBothTextareaHeights();
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;

        const result = "这里是翻译结果\n\n\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n这里是翻译结果\n\n";
        setTranslatedText(result);
    };

    const flashTranslateButtonPress = () => {
        const el = translateButtonRef.current;
        if (!el) return;

        el.classList.add("apple-press-simulated");

        window.setTimeout(() => {
            el.classList.remove("apple-press-simulated");
        }, 120);
    };

    const handleTextareaKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        // cmd/ctrl + enter -> translate
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            flashTranslateButtonPress();
            handleTranslate();
            return;
        }

        // double esc -> clear
        if (e.key === "Escape") {
            const now = Date.now();
            const threshold = 500;

            if (now - lastEscTimeRef.current < threshold) {
                e.preventDefault();
                setSourceText("");
                setTranslatedText("");
                lastEscTimeRef.current = 0;
                return;
            }

            lastEscTimeRef.current = now;
        }
    };

    return (
        <>
            <div className="border grid grid-cols-2 rounded-md bg-[#FBFBFB] dark:bg-[#0B0B0C]">
                {/* 左侧输入 */}
                <div className="border-r flex flex-col">
                    {/* left header */}
                    <div className="border-b px-4 py-2 flex justify-between items-center">
                        <div className="text-muted-foreground text-sm">{t("common.frame.input.auto_detect")}</div>

                        <ModelSelectorDialog />
                    </div>

                    {/* left body */}
                    <textarea
                        className="px-4 py-2 w-full bg-transparent border-0 outline-none focus:outline-none ring-0 focus:ring-0 shadow-none resize-none"
                        ref={inputTextareaRef}
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        onKeyDown={handleTextareaKeyDown}
                        placeholder={t("common.frame.input.placeholder")}
                    ></textarea>

                    {/* left footer */}
                    <div className="px-4 py-0 flex justify-end mb-2 mt-auto">
                        <button
                            ref={translateButtonRef}
                            className="apple-press text-sm flex items-center gap-1 border px-3 py-1 w-fit rounded-lg cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242] text-muted-foreground"
                            onClick={handleTranslate}
                        >
                            {t("common.frame.input.translate")}
                        </button>
                    </div>
                </div>

                {/* 右侧输出 */}
                <div className="flex flex-col">
                    <div className="border-b px-4 py-2 flex justify-between items-center">
                        <LanguageSelectorDialog />

                        <PromptSelectorDialog />
                    </div>

                    <textarea
                        ref={outputTextareaRef}
                        className="px-4 py-2 w-full bg-transparent border-0 outline-none focus:outline-none ring-0 focus:ring-0 shadow-none resize-none"
                        value={translatedText}
                        readOnly
                    ></textarea>
                </div>
            </div>
        </>
    )
}