import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { overview, categories, trends, budgets, recent, } from "./analytics.controller.js";
const router = Router();
router.use(authenticate);
router.get("/overview", overview);
router.get("/categories", categories);
router.get("/trends", trends);
router.get("/budgets", budgets);
router.get("/recent", recent);
export default router;
//# sourceMappingURL=analytics.routes.js.map