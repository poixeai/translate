export const parseModels = (raw: string) =>
    raw
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean);

// Return: the deduplicated array + the string concatenated with commas.
export const normalizeAndDedupeModels = (raw: string) => {
    const list = parseModels(raw);
    const unique = Array.from(new Set(list)); // Preserve the order of first appearance.
    return {
        list: unique,
        csv: unique.join(","),
        count: unique.length,
    };
};