import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Spinner } from "@/components/ui/spinner";
import { peekAuthReason } from "@/lib/auth-feedback";
import { hasStoredAuthTokens } from "@/lib/auth-session";
import { useAuth } from "@/stores/auth.store";

function FullPageSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-[#0B0B0C]">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                <span>Loading workspace...</span>
            </div>
        </div>
    );
}

export function RequireAuth() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <FullPageSpinner />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                    reason: peekAuthReason() ?? (hasStoredAuthTokens() ? "session_expired" : "auth_required"),
                }}
            />
        );
    }

    return <Outlet />;
}

export function PublicOnly() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullPageSpinner />;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
