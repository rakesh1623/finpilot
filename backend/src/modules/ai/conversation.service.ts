
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const MAX_HISTORY_MESSAGES = 20;

export async function getOwnedConversation(
    userId: string,
    conversationId: string
) {
    const conversation = await prisma.aIConversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (!conversation) {
        throw new AppError(404, "Conversation not found");
    }

    return conversation;
}

export async function getConversationContext(
    userId: string,
    conversationId: string
) {
    await getOwnedConversation(userId, conversationId);

    const messages = await prisma.aIMessage.findMany({
        where: {
            conversationId,
            conversation: { userId },
            role: {
                in: ["USER", "ASSISTANT"],
            },
        },
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],
        take: MAX_HISTORY_MESSAGES,
        select: {
            role: true,
            content: true,
        },
    });

    return messages.reverse();
}


export async function saveConversationExchange(
    userId: string,
    conversationId: string | undefined,
    userMessage: string,
    assistantMessage: string
) {
    return prisma.$transaction(
        async (tx) => {
            const now = new Date();

            const conversation = conversationId
                ? await tx.aIConversation.findFirst({
                    where: {
                        id: conversationId,
                        userId,
                    },
                })
                : await tx.aIConversation.create({
                    data: {
                        userId,
                        title: userMessage.slice(0, 60),
                    },
                });

            if (!conversation) {
                throw new AppError(
                    404,
                    "Conversation not found"
                );
            }

            await tx.aIMessage.createMany({
                data: [
                    {
                        conversationId: conversation.id,
                        role: "USER",
                        content: userMessage,
                        createdAt: now,
                    },
                    {
                        conversationId: conversation.id,
                        role: "ASSISTANT",
                        content: assistantMessage,
                        createdAt: new Date(now.getTime() + 1),
                    },
                ],
            });

            return tx.aIConversation.update({
                where: {
                    id: conversation.id,
                    userId,
                },
                data: {
                    updatedAt: new Date(now.getTime() + 1),
                },
            });
        },
        {
            maxWait: 10000,
            timeout: 15000,
        }
    );
}


export async function listConversations(
    userId: string,
    page: number,
    limit: number
) {
    const where = { userId };

    const [conversations, total] = await prisma.$transaction([
        prisma.aIConversation.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { updatedAt: "desc" },
                { id: "desc" },
            ],
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { messages: true },
                },
            },
        }),
        prisma.aIConversation.count({ where }),
    ]);

    return {
        conversations,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getConversationHistory(
    userId: string,
    conversationId: string,
    page: number,
    limit: number
) {
    const conversation = await getOwnedConversation(
        userId,
        conversationId
    );

    const where = {
        conversationId,
        conversation: { userId },
    };

    const [messages, total] = await prisma.$transaction([
        prisma.aIMessage.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ],
        }),
        prisma.aIMessage.count({ where }),
    ]);

    return {
        conversation,
        messages: messages.reverse(),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function renameConversation(
    userId: string,
    conversationId: string,
    title: string
) {
    const result = await prisma.aIConversation.updateMany({
        where: {
            id: conversationId,
            userId,
        },
        data: { title },
    });

    if (result.count === 0) {
        throw new AppError(404, "Conversation not found");
    }

    return getOwnedConversation(userId, conversationId);
}

export async function deleteConversation(
    userId: string,
    conversationId: string
) {
    const result = await prisma.aIConversation.deleteMany({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (result.count === 0) {
        throw new AppError(404, "Conversation not found");
    }

    return { id: conversationId };
}
