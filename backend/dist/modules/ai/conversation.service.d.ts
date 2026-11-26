export declare function getOwnedConversation(userId: string, conversationId: string): Promise<{
    id: string;
    userId: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getConversationContext(userId: string, conversationId: string): Promise<{
    content: string;
    role: import("../../../generated/prisma/index.js").$Enums.MessageRole;
}[]>;
export declare function saveConversationExchange(userId: string, conversationId: string | undefined, userMessage: string, assistantMessage: string): Promise<{
    id: string;
    userId: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listConversations(userId: string, page: number, limit: number): Promise<{
    conversations: {
        _count: {
            messages: number;
        };
        createdAt: Date;
        id: string;
        title: string | null;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getConversationHistory(userId: string, conversationId: string, page: number, limit: number): Promise<{
    conversation: {
        id: string;
        userId: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    messages: {
        id: string;
        conversationId: string;
        role: import("../../../generated/prisma/index.js").$Enums.MessageRole;
        content: string;
        createdAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function renameConversation(userId: string, conversationId: string, title: string): Promise<{
    id: string;
    userId: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteConversation(userId: string, conversationId: string): Promise<{
    id: string;
}>;
