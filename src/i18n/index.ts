import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import ru from "./locales/ru.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";
import nl from "./locales/nl.json";
import ar from "./locales/ar.json";
import hi from "./locales/hi.json";
import id from "./locales/id.json";

i18n
    .use(LanguageDetector) // auto detect language
    .use(initReactI18next) // React bindings
    .init({
        resources: {
            en: { translation: en },
            "zh-CN": { translation: zhCN },
            "zh-TW": { translation: zhTW },
            ja: { translation: ja },
            ko: { translation: ko },
            ru: { translation: ru },
            fr: { translation: fr },
            de: { translation: de },
            es: { translation: es },
            pt: { translation: pt },
            it: { translation: it },
            nl: { translation: nl },
            ar: { translation: ar },
            hi: { translation: hi },
            id: { translation: id },
        },
        fallbackLng: "en", // if not detected, use English
        interpolation: {
            escapeValue: false, 
        },
        detection: {
            // auto detect language settings
            order: ["localStorage", "navigator", "htmlTag"], // priority order
            caches: ["localStorage"], // store the selected language in localStorage
        },
    });

export default i18n;
