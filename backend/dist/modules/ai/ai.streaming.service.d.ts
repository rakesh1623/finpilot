import type { SSEEvent } from "../../utils/sse.js";
type ConversationHistory = {
    role: string;
    content: string;
}[];
type StreamingOptions = {
    userId: string;
    message: string;
    conversationId?: string;
    history: ConversationHistory;
    signal: AbortSignal;
    send: (event: SSEEvent, data: unknown) => void;
};
export declare function streamFinancialCopilot(options: StreamingOptions): Promise<void>;
export {};
