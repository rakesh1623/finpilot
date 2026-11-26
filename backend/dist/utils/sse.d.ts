import type { Response } from "express";
export type SSEEvent = "start" | "tool_start" | "tool_end" | "token" | "reset" | "done" | "error";
export declare function createSSEStream(res: Response): {
    send: (event: SSEEvent, data: unknown) => void;
    close: () => void;
    isOpen: () => boolean;
    signal: AbortSignal;
};
