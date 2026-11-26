export declare function askFinancialCopilot(userId: string, message: string, conversationId?: string): Promise<{
    conversationId: string;
    title: string | null;
    answer: string;
    toolsUsed: string[];
}>;
