import PageFiller from "@/components/dev/PageFiller";
import { useTranslation } from "react-i18next";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import TextareaAutosize from "react-textarea-autosize"

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid w-full max-w-xl gap-6 m-10">
                <InputGroup>
                    <TextareaAutosize
                        data-slot="input-group-control"
                        className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                        placeholder="Autoresize textarea..."
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton className="ml-auto" size="sm" variant="default">
                            Submit
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>

                <p className="text-2xl">
                    ChatGPT AI 翻译测试 Interface Design Typography 123456
                </p>

                <div className="w-full border h-50 overflow-hidden flex flex-col">
                    <div className="border border-red-500">header</div>
                    <PageFiller className="overflow-y-auto"/>
                </div>
            </div>
        </>
    )
}