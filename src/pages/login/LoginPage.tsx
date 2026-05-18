import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircleIcon, Languages, LockKeyhole, UserCircle2 } from "lucide-react";

import { AuthReasonNotice } from "@/components/common/AuthNotice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { consumeAuthReason } from "@/lib/auth-feedback";
import { useAuth } from "@/stores/auth.store";

const AUTH_REASON_MESSAGES: Record<string, string> = {
    auth_required: "Sign in to access the translation workspace and its protected settings.",
    session_expired: "Your previous session expired or could not be refreshed. Sign in again to continue.",
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuth((state) => state.login);
    const isLoading = useAuth((state) => state.isLoading);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [authReason, setAuthReason] = useState<string | null>(null);

    const locationState = location.state as { from?: { pathname?: string }; reason?: string } | null;
    const from = locationState?.from?.pathname || "/";

    useEffect(() => {
        setAuthReason(locationState?.reason ?? consumeAuthReason());
    }, [locationState?.reason]);

    const authReasonMessage = useMemo(() => {
        if (!authReason) return null;
        return AUTH_REASON_MESSAGES[authReason] ?? AUTH_REASON_MESSAGES.auth_required;
    }, [authReason]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const message = typeof err === "object" && err !== null && "message" in err
                ? String((err as { message?: string }).message ?? "Unable to sign in")
                : "Unable to sign in";
            setError(message);
        }
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fb_0%,#eef2f7_100%)] dark:bg-[linear-gradient(180deg,#0B0B0C_0%,#131417_100%)] text-foreground">
            <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <section className="flex flex-col justify-center gap-6 rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/8 dark:bg-white/4 dark:shadow-none">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-black/3 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground dark:border-white/10 dark:bg-white/5">
                            <Languages className="size-3.5" />
                            Poixe Translate
                        </div>

                        <div className="space-y-4">
                            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                                Sign in to keep translation, prompts, and admin settings in one place.
                            </h1>
                            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                                This workspace now uses server-backed authentication. Your session survives reloads, expired access tokens refresh automatically, and protected pages stay locked down.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-black/8 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                                <div className="mb-2 text-sm font-medium">Persistent session</div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Access and refresh tokens are stored locally so the app can restore your session after a refresh.
                                </p>
                            </div>
                            <div className="rounded-xl border border-black/8 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                                <div className="mb-2 text-sm font-medium">Safer API flow</div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Protected API requests retry once through the refresh endpoint before sending you back to sign in.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_24px_100px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-[#111214] dark:shadow-none sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#101828] text-white dark:bg-white dark:text-[#101828]">
                                <LockKeyhole className="size-5" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">Account access</div>
                                <div className="text-sm text-muted-foreground">Use your workspace username and password.</div>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {authReasonMessage ? <AuthReasonNotice message={authReasonMessage} /> : null}

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <UserCircle2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        autoComplete="username"
                                        className="pl-10"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        placeholder="admin"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {error ? (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>Sign-in failed</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : null}

                            <Button type="submit" className="w-full" disabled={isLoading || !username.trim() || !password.trim()}>
                                {isLoading ? <Spinner className="size-4" /> : null}
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
