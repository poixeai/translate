import ModelSelectorDialog from './comps/ModelSelectorDialog';

export function Translator() {

    return (
        <>
            <div className="border grid grid-cols-2 rounded-md bg-[#FBFBFB] dark:bg-[#0B0B0C]">
                {/* 左侧输入 */}
                <div className="border-r">
                    {/* left header */}
                    <div className="border-b px-4 py-2 flex justify-between items-center">
                        <div className="text-muted-foreground text-sm">自动检测</div>

                        <ModelSelectorDialog />
                    </div>

                    {/* left body */}
                    <textarea
                        className="px-4 py-2 w-full flex-1 bg-transparent border-0 outline-none focus:outline-none ring-0 focus:ring-0 shadow-none resize-none"
                    ></textarea>

                    {/* left footer */}
                    <div className="px-4 py-0 flex justify-end mb-2">
                        <button
                            className="text-sm flex items-center gap-1 border px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-[#ececec] dark:bg-[#2f2f2f] dark:hover:bg-[#424242] text-muted-foreground"
                        >
                            翻译
                        </button>
                    </div>
                </div>

                {/* 右侧输出 */}
                <div className="flex">
                    <div>right</div>
                </div>
            </div>
        </>
    )
}