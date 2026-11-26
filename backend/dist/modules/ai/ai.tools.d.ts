import type OpenAI from "openai";
export declare const financialTools: OpenAI.Responses.Tool[];
export declare function executeFinancialTool(name: string, rawArguments: string, userId: string): Promise<unknown>;
