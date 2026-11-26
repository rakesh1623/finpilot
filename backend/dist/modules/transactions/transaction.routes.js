import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { create, getAll, getOne, update, remove, } from "./transaction.controller.js";
const router = Router();
router.use(authenticate);
router.route("/")
    .post(create)
    .get(getAll);
router.route("/:id")
    .get(getOne)
    .patch(update)
    .delete(remove);
export default router;
//# sourceMappingURL=transaction.routes.js.map