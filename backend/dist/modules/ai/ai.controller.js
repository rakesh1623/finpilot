import { askFinancialCopilot } from "./ai.service.js";
import { chatSchema, conversationIdSchema, updateConversationSchema, conversationQuerySchema, messageQuerySchema, } from "./ai.validation.js";
import { listConversations, getConversationHistory, renameConversation, deleteConversation, getConversationContext } from "./conversation.service.js";
import { createSSEStream } from "../../utils/sse.js";
import { AppError } from "../../utils/AppError.js";
import { streamFinancialCopilot, } from "./ai.streaming.service.js";
export async function chat(req, res) {
    const { message, conversationId } = chatSchema.parse(req.body);
    const result = await askFinancialCopilot(req.user.userId, message, conversationId);
    return res.status(200).json({
        success: true,
        data: result,
    });
}
export async function getConversations(req, res) {
    const { page, limit } = conversationQuerySchema.parse(req.query);
    const result = await listConversations(req.user.userId, page, limit);
    return res.status(200).json({
        success: true,
        data: result,
    });
}
export async function getConversation(req, res) {
    const conversationId = conversationIdSchema.parse(req.params.id);
    const { page, limit } = messageQuerySchema.parse(req.query);
    const result = await getConversationHistory(req.user.userId, conversationId, page, limit);
    return res.status(200).json({
        success: true,
        data: result,
    });
}
export async function updateConversation(req, res) {
    const conversationId = conversationIdSchema.parse(req.params.id);
    const { title } = updateConversationSchema.parse(req.body);
    const conversation = await renameConversation(req.user.userId, conversationId, title);
    return res.status(200).json({
        success: true,
        message: "Conversation updated successfully",
        data: { conversation },
    });
}
export async function removeConversation(req, res) {
    const conversationId = conversationIdSchema.parse(req.params.id);
    const result = await deleteConversation(req.user.userId, conversationId);
    return res.status(200).json({
        success: true,
        message: "Conversation deleted successfully",
        data: result,
    });
}
export async function streamChat(req, res) {
    const { message, conversationId } = chatSchema.parse(req.body);
    const userId = req.user.userId;
    // Validate conversation ownership before sending
    // the SSE response headers.
    const history = conversationId
        ? await getConversationContext(userId, conversationId)
        : [];
    if (res.destroyed) {
        return;
    }
    const sse = createSSEStream(res);
    // Overall request deadline.
    const signal = AbortSignal.any([
        sse.signal,
        AbortSignal.timeout(120000),
    ]);
    try {
        await streamFinancialCopilot({
            userId,
            message,
            conversationId,
            history,
            signal,
            send: sse.send,
        });
    }
    catch (error) {
        console.error("[SSE] Streaming error:", error);
        if (sse.signal.aborted) {
            return;
        }
        if (signal.aborted) {
            sse.send("error", {
                message: "AI request timed out",
            });
            return;
        }
        const statusCode = error instanceof AppError
            ? error.statusCode
            : 500;
        sse.send("error", {
            statusCode,
            message: error instanceof AppError
                ? error.message
                : "Unable to complete AI response",
        });
    }
    finally {
        sse.close();
    }
}
//# sourceMappingURL=ai.controller.js.map