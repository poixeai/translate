
export interface Language {
    code: string;
    i18nKey: string;
    nativeName: string;
    searchTerms: string[];
}

export const LANGUAGES: Language[] = [
    {
        code: "en",
        i18nKey: "languages.en",
        nativeName: "English",
        searchTerms: ["英语", "english", "英文", "yingyu", "yingwen"],
    },
    {
        code: "zh-CN",
        i18nKey: "languages.zh-CN",
        nativeName: "简体中文",
        searchTerms: ["简体中文", "chinese", "simplified", "zhongwen", "jiantizhongwen", "hanyu", "汉语"],
    },
    {
        code: "zh-TW",
        i18nKey: "languages.zh-TW",
        nativeName: "繁體中文",
        searchTerms: ["繁體中文", "繁体中文", "traditional chinese", "traditional", "zhongwen", "fantizhongwen", "hanyu", "漢語"],
    },
    {
        code: "ja",
        i18nKey: "languages.ja",
        nativeName: "日本語",
        searchTerms: ["日语", "日文", "japanese", "nihongo", "riyu", "riwen", "日本语", "日本語"],
    },
];