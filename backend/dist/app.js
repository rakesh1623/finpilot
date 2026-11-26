import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import budgetRoutes from "./modules/budgets/budget.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import importRoutes from "./modules/imports/import.routes.js";
import receiptRoutes from "./modules/receipts/receipt.routes.js";
const app = express();
app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp({
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "res.headers['set-cookie']",
        ],
        censor: "[REDACTED]",
    },
}));
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FinPilot API is running",
        timestamp: new Date().toISOString()
    });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/imports", importRoutes);
app.use("/api/v1/receipts", receiptRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map