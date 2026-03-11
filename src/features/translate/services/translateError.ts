
export class TranslateKnownError extends Error {
    code: string;

    constructor(code: string) {
        super(code);
        this.name = "TranslateKnownError";
        this.code = code;
    }
}