const SESSION_NOTICE_KEY = "translate.session_notice";
const AUTH_REASON_KEY = "translate.auth_reason";

function getSessionStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
}

export function queueSessionNotice(message: string) {
    getSessionStorage()?.setItem(SESSION_NOTICE_KEY, message);
}

export function consumeSessionNotice(): string | null {
    const storage = getSessionStorage();
    if (!storage) return null;
    const value = storage.getItem(SESSION_NOTICE_KEY);
    if (value) storage.removeItem(SESSION_NOTICE_KEY);
    return value;
}

export function setAuthReason(reason: string) {
    getSessionStorage()?.setItem(AUTH_REASON_KEY, reason);
}

export function peekAuthReason(): string | null {
    return getSessionStorage()?.getItem(AUTH_REASON_KEY) ?? null;
}

export function consumeAuthReason(): string | null {
    const storage = getSessionStorage();
    if (!storage) return null;
    const value = storage.getItem(AUTH_REASON_KEY);
    if (value) storage.removeItem(AUTH_REASON_KEY);
    return value;
}
