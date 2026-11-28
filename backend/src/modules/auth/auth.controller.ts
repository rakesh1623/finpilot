
import { Request, Response } from "express";

import {
    registerUser,
    loginUser,
    getUserById,
} from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

import {
    setAuthCookie,
    clearAuthCookie,
} from "../../utils/authCookie.js";

export async function register(
    req: Request,
    res: Response
) {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);
    setAuthCookie(res, result.token);
    return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: getAuthResponse(req, result),
    });
}

export async function login(
    req: Request,
    res: Response
) {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);
    setAuthCookie(res, result.token);
    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: getAuthResponse(req, result),
    });
}

export async function getMe(
    req: Request,
    res: Response
) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    const user = await getUserById(req.user.userId);

    return res.status(200).json({
        success: true,
        data: { user },
    });
}
function getAuthResponse(
    req: Request,
    result: {
        user: unknown;
        token: string;
    }
) {
    const cookieOnly =
        req.get("x-auth-mode") === "cookie";

    return cookieOnly
        ? { user: result.user }
        : result;
}

export function logout(
    _req: Request,
    res: Response
) {
    clearAuthCookie(res);

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}