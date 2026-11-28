
import type {
    CookieOptions,
    Response,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME =
    "finpilot_access_token";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

export function setAuthCookie(
    res: Response,
    token: string
) {
    const payload = jwt.decode(token);

    if (
        !payload ||
        typeof payload === "string" ||
        typeof payload.exp !== "number"
    ) {
        throw new Error(
            "Invalid authentication token"
        );
    }

    const maxAge = Math.max(
        0,
        payload.exp * 1000 - Date.now()
    );

    res.cookie(AUTH_COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge,
    });
}

export function clearAuthCookie(
    res: Response
) {
    res.clearCookie(
        AUTH_COOKIE_NAME,
        cookieOptions
    );
}
