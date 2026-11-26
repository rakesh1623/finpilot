
import type OpenAI from "openai";

import { openai } from "../../lib/openai.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";

import type { SSEEvent } from "../../utils/sse.js";

import { buildAIInstructions } from "./ai.instructions.js";

import {
    financialTools,
    executeFinancialTool,
} from "./ai.tools.js";

import {
    saveConversationExchange,
} from "./conversation.service.js";

const MAX_TOOL_ROUNDS = 5;

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

export async function streamFinancialCopilot(
    options: StreamingOptions
) {
    const {
        userId,
        message,
        conversationId,
        history,
        signal,
        send,
    } = options;

    const instructions = buildAIInstructions();

    const input: OpenAI.Responses.ResponseInputItem[] =
        history.map((item) => ({
            role: item.role === "USER"
                ? "user"
                : "assistant",
            content: item.content,
        }));

    input.push({
        role: "user",
        content: message,
    });

    const toolsUsed: string[] = [];

    send("start", {
        conversationId: conversationId ?? null,
        status: "processing",
    });

    for (
        let round = 0;
        round <= MAX_TOOL_ROUNDS;
        round++
    ) {
        signal.throwIfAborted();

        const stream = await openai.responses.create(
            {
                model: env.OPENAI_MODEL,
                instructions,
                input,
                tools: financialTools,
                tool_choice:
                    round === MAX_TOOL_ROUNDS
                        ? "none"
                        : "auto",
                parallel_tool_calls: false,
                store: false,
                max_output_tokens: 1200,
                stream: true,
            },
            {
                signal,
            }
        );

        let completedResponse:
            OpenAI.Responses.Response | undefined;

        let streamedText = "";

        for await (const event of stream) {
            signal.throwIfAborted();

            switch (event.type) {
                case "response.output_text.delta": {
                    streamedText += event.delta;

                    send("token", {
                        text: event.delta,
                    });

                    break;
                }

                case "response.completed": {
                    console.log("[SSE] OpenAI response completed");

                    completedResponse = event.response;
                    break;
                }

                case "response.failed":
                case "response.incomplete":
                case "error": {
                    throw new AppError(
                        502,
                        "AI response could not be completed"
                    );
                }
            }
        }

        signal.throwIfAborted();

        if (!completedResponse) {
            throw new AppError(
                502,
                "AI stream ended unexpectedly"
            );
        }

        const calls = completedResponse.output.filter(
            (item) => item.type === "function_call"
        );

        // Case 1: Final answer received.
        if (calls.length === 0) {
            const answer = streamedText.trim();

            if (!answer) {
                throw new AppError(
                    502,
                    "AI did not return an answer"
                );
            }
            console.log("[SSE] Final answer generated");
            console.log("[SSE] Answer length:", answer.length);


            signal.throwIfAborted();
            console.log("[SSE] Saving conversation...");
            const conversation =
                await saveConversationExchange(
                    userId,
                    conversationId,
                    message,
                    answer
                );

            console.log("[SSE] Conversation saved successfully");

            signal.throwIfAborted();
            console.log("[SSE] Sending done event");

            send("done", {
                conversationId: conversation.id,
                title: conversation.title,
                answer,
                toolsUsed,
            });

            return;
        }

        // Case 2: Financial tools must be executed.
        if (round === MAX_TOOL_ROUNDS) {
            break;
        }

        input.push(...calls);

        // A model may emit intermediate text before
        // requesting a tool. Clear that provisional text.
        if (streamedText.length > 0) {
            send("reset", {
                reason: "additional_tool_execution",
            });
        }

        for (const call of calls) {
            signal.throwIfAborted();

            send("tool_start", {
                name: call.name,
            });

            const result = await executeFinancialTool(
                call.name,
                call.arguments,
                userId
            );

            signal.throwIfAborted();

            toolsUsed.push(call.name);

            input.push({
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify(result),
            });

            const failed =
                typeof result === "object" &&
                result !== null &&
                "error" in result;

            send("tool_end", {
                name: call.name,
                status: failed ? "failed" : "completed",
            });
        }
    }

    throw new AppError(
        502,
        "AI exceeded the maximum tool-call rounds"
    );
}
