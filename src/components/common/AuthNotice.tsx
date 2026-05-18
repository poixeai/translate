import { useEffect, useState } from "react";
import { BadgeCheck, Info, X } from "lucide-react";

import { consumeSessionNotice } from "@/lib/auth-feedback";

export default function AuthNotice() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setMessage(consumeSessionNotice());
    }, []);

    if (!message) return null;

    return (
        <div className="border-b bg-[#eef6ff] text-[#12324a] dark:bg-[#11202d] dark:text-[#d8ebff]">
            <div className="max-w-7xl mx-auto flex items-start justify-between gap-3 px-3 py-2 text-sm">
                <div className="flex items-start gap-2 min-w-0">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0" />
                    <span className="leading-6">{message}</span>
                </div>
                <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Dismiss session notice"
                    onClick={() => setMessage(null)}
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}

export function AuthReasonNotice({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-[#f3c7cd] bg-[#fff4f5] px-4 py-3 text-sm text-[#7c2432] dark:border-[#6b2630] dark:bg-[#2a161a] dark:text-[#ffd7dd]">
            <div className="flex items-start gap-2">
                <Info className="mt-0.5 size-4 shrink-0" />
                <span className="leading-6">{message}</span>
            </div>
        </div>
    );
}
