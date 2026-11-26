import { Request, Response } from "express";
export declare function overview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function categories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function trends(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function budgets(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function recent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
