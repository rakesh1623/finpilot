
import { Router } from "express";

import {
    authenticate,
} from "../../middleware/auth.middleware.js";

import {
    uploadTransactionFile,
} from "../../middleware/upload.middleware.js";

import {
    upload,
    getAll,
    getPreview,
    confirm,
    remove,
} from "./import.controller.js";

const router = Router();

router.use(authenticate);

router.post(
    "/upload",
    uploadTransactionFile.single("file"),
    upload
);

router.get("/", getAll);

router.get("/:id", getPreview);

router.post("/:id/confirm", confirm);

router.delete("/:id", remove);

export default router;
