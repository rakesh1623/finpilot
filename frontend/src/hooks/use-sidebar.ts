
"use client";

import {
    useCallback,
    useSyncExternalStore,
} from "react";

const STORAGE_KEY =
    "finpilot-sidebar-collapsed";

const CHANGE_EVENT =
    "finpilot-sidebar-change";

let fallbackCollapsed = false;

function subscribe(
    onStoreChange: () => void
) {
    function handleStorage(
        event: StorageEvent
    ) {
        if (
            event.key === STORAGE_KEY ||
            event.key === null
        ) {
            onStoreChange();
        }
    }

    window.addEventListener(
        "storage",
        handleStorage
    );

    window.addEventListener(
        CHANGE_EVENT,
        onStoreChange
    );

    return () => {
        window.removeEventListener(
            "storage",
            handleStorage
        );

        window.removeEventListener(
            CHANGE_EVENT,
            onStoreChange
        );
    };
}

function getSnapshot(): boolean {
    try {
        return (
            localStorage.getItem(STORAGE_KEY) ===
            "true"
        );
    } catch {
        return fallbackCollapsed;
    }
}

function getServerSnapshot(): boolean {
    return false;
}

export function useSidebar() {
    const collapsed = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const setCollapsed = useCallback(
        (value: boolean) => {
            fallbackCollapsed = value;

            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    String(value)
                );
            } catch {
                // Continue using in-memory preference
                // if browser storage is unavailable.
            }

            window.dispatchEvent(
                new Event(CHANGE_EVENT)
            );
        },
        []
    );

    const toggleSidebar = useCallback(() => {
        setCollapsed(!getSnapshot());
    }, [setCollapsed]);

    return {
        collapsed,
        setCollapsed,
        toggleSidebar,
    };
}
