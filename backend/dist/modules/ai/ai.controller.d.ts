import { Request, Response } from "express";
export declare function chat(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getConversations(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getConversation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateConversation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removeConversation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function streamChat(req: Request, res: Response): Promise<void>;
