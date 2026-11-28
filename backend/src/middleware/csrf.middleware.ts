
import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const SAFE_METHODS = new Set([
    "GET",
    "HEAD",
    "OPTIONS",
]);

export function csrfProtection(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const origin = req.get("origin");

    const allowedOrigin = new URL(
        env.FRONTEND_URL
    ).origin;

    // Reject requests from untrusted browser origins.
    if (origin && origin !== allowedOrigin) {
        return next(
            new AppError(
                403,
                "Request origin is not allowed"
            )
        );
    }

    // Explicit Bearer authentication is supported
    // for Postman and non-browser API clients.
    const authorization =
        req.get("authorization");

    const hasBearerToken =
        authorization?.startsWith("Bearer ") &&
        authorization.slice(7).trim().length > 0;

    if (hasBearerToken) {
        return next();
    }

    // Browser requests must originate from
    // our trusted frontend.
    if (origin !== allowedOrigin) {
        return next(
            new AppError(
                403,
                "Request origin could not be verified"
            )
        );
    }

    next();
}
