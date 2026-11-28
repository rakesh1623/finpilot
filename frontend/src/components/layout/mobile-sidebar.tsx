
"use client";

import { useState } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

import { AppLogo } from "./app-logo";

import {
    SidebarNavigation,
} from "./sidebar-navigation";

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    function closeSidebar() {
        setOpen(false);
    }

    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}
        >
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open navigation menu"
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex w-70 max-w-[85vw] flex-col gap-0 p-0 sm:max-w-70"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>
                        FinPilot navigation
                    </SheetTitle>

                    <SheetDescription>
                        Navigate between your financial
                        workspaces.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex h-16 shrink-0 items-center border-b px-5 pr-12">
                    <AppLogo
                        onClick={closeSidebar}
                    />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
                    <SidebarNavigation
                        onNavigate={closeSidebar}
                    />
                </div>

                <div className="border-t p-4">
                    <p className="text-xs text-muted-foreground">
                        FinPilot AI — Financial Intelligence
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
