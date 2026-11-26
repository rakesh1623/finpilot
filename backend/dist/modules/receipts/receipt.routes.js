import { Router } from "express";
import { authenticate, } from "../../middleware/auth.middleware.js";
import { uploadReceiptImage, } from "../../middleware/receipt-upload.middleware.js";
import { scan, getAll, getOne, update, confirm, remove, } from "./receipt.controller.js";
const router = Router();
router.use(authenticate);
router.post("/scan", uploadReceiptImage.single("file"), scan);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.post("/:id/confirm", confirm);
router.delete("/:id", remove);
export default router;
//# sourceMappingURL=receipt.routes.js.map