const ACCESS_TOKEN_KEY = "translate.access_token";
const REFRESH_TOKEN_KEY = "translate.refresh_token";

function getStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    return window.localStorage;
}

export function getAccessToken(): string | null {
    return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getRefreshToken(): string | null {
    return getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function saveAuthTokens(accessToken: string, refreshToken: string) {
    const storage = getStorage();
    if (!storage) return;

    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredAuthTokens(): boolean {
    return Boolean(getAccessToken() || getRefreshToken());
}
