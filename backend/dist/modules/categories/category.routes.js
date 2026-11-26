import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getAll, create, update, remove, } from "./category.controller.js";
const router = Router();
router.use(authenticate);
router.route("/")
    .get(getAll)
    .post(create);
router.route("/:id")
    .patch(update)
    .delete(remove);
export default router;
//# sourceMappingURL=category.routes.js.map