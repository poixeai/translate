export const parseModels = (raw: string) =>
    raw
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean);

/** 返回：去重后的数组 + 用逗号拼好的字符串 */
export const normalizeAndDedupeModels = (raw: string) => {
    const list = parseModels(raw);
    const unique = Array.from(new Set(list)); // 保留首次出现顺序
    return {
        list: unique,
        csv: unique.join(","),
        count: unique.length,
    };
};

// 这三个输出（list/csv/count）能覆盖你所有需求：写库用 csv，显示数量用 count，以后要显示 chip 用 list。
// list: ["model1", "model2", "model3"]
// csv: "model1,model2,model3"
// count: 3