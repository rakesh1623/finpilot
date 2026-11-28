
import type {
    Request,
    Response,
    NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

import {
    AUTH_COOKIE_NAME,
} from "../utils/authCookie.js";

export function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const authorization =
        req.get("authorization");

    let token: string | undefined;

    // Bearer authentication takes priority.
    if (authorization !== undefined) {
        if (
            !authorization.startsWith("Bearer ")
        ) {
            return next(
                new AppError(
                    401,
                    "Invalid authorization header"
                )
            );
        }

        token = authorization.slice(7).trim();
    } else {
        const cookieToken =
            req.cookies?.[AUTH_COOKIE_NAME];

        if (typeof cookieToken === "string") {
            token = cookieToken;
        }
    }

    if (!token) {
        return next(
            new AppError(
                401,
                "Authentication required"
            )
        );
    }

    try {
        const payload = jwt.verify(
            token,
            env.JWT_SECRET,
            {
                algorithms: ["HS256"],
            }
        );

        if (
            typeof payload === "string" ||
            typeof payload.sub !== "string" ||
            !payload.sub
        ) {
            throw new Error("Invalid token payload");
        }

        req.user = {
            userId: payload.sub,
        };

        next();
    } catch {
        next(
            new AppError(
                401,
                "Invalid or expired session"
            )
        );
    }
}
