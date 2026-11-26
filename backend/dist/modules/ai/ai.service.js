import { openai } from "../../lib/openai.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { buildAIInstructions } from "./ai.instructions.js";
import { financialTools, executeFinancialTool, } from "./ai.tools.js";
import { getConversationContext, saveConversationExchange, } from "./conversation.service.js";
const MAX_TOOL_ROUNDS = 5;
export async function askFinancialCopilot(userId, message, conversationId) {
    const history = conversationId
        ? await getConversationContext(userId, conversationId)
        : [];
    const instructions = buildAIInstructions();
    const input = history.map((item) => ({
        role: item.role === "USER"
            ? "user"
            : "assistant",
        content: item.content,
    }));
    input.push({
        role: "user",
        content: message,
    });
    const toolsUsed = [];
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const response = await openai.responses.create({
            model: env.OPENAI_MODEL,
            instructions,
            input,
            tools: financialTools,
            tool_choice: round === MAX_TOOL_ROUNDS ? "none" : "auto",
            parallel_tool_calls: false,
            store: false,
            max_output_tokens: 1200,
        });
        const calls = response.output.filter((item) => item.type === "function_call");
        if (calls.length === 0) {
            const answer = response.output_text.trim();
            if (!answer || response.status !== "completed") {
                throw new AppError(502, "AI did not return a complete answer");
            }
            const conversation = await saveConversationExchange(userId, conversationId, message, answer);
            return {
                conversationId: conversation.id,
                title: conversation.title,
                answer,
                toolsUsed,
            };
        }
        input.push(...calls);
        if (round === MAX_TOOL_ROUNDS) {
            break;
        }
        for (const call of calls) {
            const result = await executeFinancialTool(call.name, call.arguments, userId);
            toolsUsed.push(call.name);
            input.push({
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify(result),
            });
        }
    }
    throw new AppError(502, "AI exceeded the maximum tool-call rounds");
}
//# sourceMappingURL=ai.service.js.map