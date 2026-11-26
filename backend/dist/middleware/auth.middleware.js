import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError(401, "Authentication token required"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload === "string" || !payload.sub) {
            return next(new AppError(401, "Invalid authentication token"));
        }
        req.user = {
            userId: payload.sub,
        };
        return next();
    }
    catch {
        return next(new AppError(401, "Invalid or expired token"));
    }
}
//# sourceMappingURL=auth.middleware.js.map