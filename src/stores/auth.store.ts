import { create } from "zustand";

import { api } from "@/lib/api";
import { consumeAuthReason, queueSessionNotice, setAuthReason } from "@/lib/auth-feedback";
import { clearAuthTokens, hasStoredAuthTokens } from "@/lib/auth-session";
import { usePreferences } from "@/stores/preferences.store";

export type UserRole = "ADMIN" | "USER";

export type User = {
    id: number;
    username: string;
    role: UserRole;
    display_name: string;
    email: string;
    created_at: number;
};

type AuthState = {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: true,

    setUser: (user) => set({ user, isLoading: false }),

    login: async (username, password) => {
        set({ isLoading: true });
        try {
            await api.login({ username, password });
            const data = await api.getCurrentUser();
            
            try {
                const prefs = await api.getPreferences();
                usePreferences.getState().loadFromServer(prefs as any);
            } catch (e) {
                console.error("Failed to sync preferences", e);
            }

            consumeAuthReason();
            queueSessionNotice("Signed in successfully. Access tokens refresh automatically, and the refresh session stays valid for up to 7 days unless you sign out.");
            set({ user: data.user, isLoading: false });
        } catch (error) {
            clearAuthTokens();
            set({ user: null, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.logout();
        } catch {}

        clearAuthTokens();
        set({ user: null, isLoading: false });
        window.location.href = "/login";
    },

    fetchCurrentUser: async () => {
        set({ isLoading: true });

        if (!hasStoredAuthTokens()) {
            set({ user: null, isLoading: false });
            return;
        }

        try {
            const data = await api.getCurrentUser();
            
            try {
                const prefs = await api.getPreferences();
                usePreferences.getState().loadFromServer(prefs as any);
            } catch (e) {
                console.error("Failed to sync preferences", e);
            }

            set({ user: data.user, isLoading: false });
        } catch {
            setAuthReason("session_expired");
            clearAuthTokens();
            set({ user: null, isLoading: false });
        }
    },
}));
