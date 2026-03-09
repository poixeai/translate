import { useTranslation } from "react-i18next";
import { Translator } from "@/features/translate";

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <>
            <div className="max-w-7xl mx-auto px-2 pt-4">
                <Translator />
            </div>
        </>
    )
}