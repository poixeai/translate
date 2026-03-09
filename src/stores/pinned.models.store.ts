import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PinnedModelKey = string; // ${providerId}:${model}

type State = {
    pinned: PinnedModelKey[];
    isPinned: (key: PinnedModelKey) => boolean;
    toggle: (key: PinnedModelKey) => void;
    removeMany: (keys: PinnedModelKey[]) => void;
}

export const usePinnedModels = create<State>()(
    persist(
        (set, get) => ({
            pinned: [],
            isPinned: (key) => get().pinned.includes(key),
            toggle: (key) => set((s) => ({
                pinned: s.pinned.includes(key)
                    ? s.pinned.filter((k) => k !== key)
                    : [key, ...s.pinned]
            })),
            removeMany: (keys) => set((s) => ({
                pinned: s.pinned.filter((k) => !keys.includes(k),)
            })),
        }),
        {
            name: "poixe_translate_pinned_models", // localStorage key
            version: 1,
        }
    )
)