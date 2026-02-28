import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <>
        <div className="border">
            <h1>Home</h1>
            <p>Welcome!</p>
            <p>{t("common.test")}</p>
        </div>
        </>
    )
}