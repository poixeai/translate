import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";

i18n
    .use(LanguageDetector) // auto detect language
    .use(initReactI18next) // React bindings
    .init({
        resources: {
            "en": { translation: en },
            "zh-CN": { translation: zhCN },
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
