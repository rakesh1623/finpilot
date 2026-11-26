import type { Request, Response } from "express";
export declare function upload(req: Request, res: Response): Promise<void>;
export declare function getAll(req: Request, res: Response): Promise<void>;
export declare function getPreview(req: Request, res: Response): Promise<void>;
export declare function confirm(req: Request, res: Response): Promise<void>;
export declare function remove(req: Request, res: Response): Promise<void>;
