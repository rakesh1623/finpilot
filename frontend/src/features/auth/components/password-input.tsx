
"use client";

import {
    forwardRef,
    useState,
    type ComponentProps,
} from "react";

import {
    Eye,
    EyeOff,
} from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<
    ComponentProps<"input">,
    "type"
>;

export const PasswordInput = forwardRef<
    HTMLInputElement,
    PasswordInputProps
>(function PasswordInput(
    { className, ...props },
    ref
) {
    const [visible, setVisible] =
        useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                ref={ref}
                type={visible ? "text" : "password"}
                className={`pr-10 ${className ?? ""}`}
            />

            <button
                type="button"
                disabled={props.disabled}
                aria-label={
                    visible
                        ? "Hide password"
                        : "Show password"
                }
                aria-pressed={visible}
                onClick={() =>
                    setVisible((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
                {visible ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
});
