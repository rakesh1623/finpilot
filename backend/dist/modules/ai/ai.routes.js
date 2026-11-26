import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { chat, streamChat, getConversations, getConversation, updateConversation, removeConversation, } from "./ai.controller.js";
const router = Router();
router.use(authenticate);
router.post("/chat", chat);
router.post("/chat/stream", streamChat);
router.get("/conversations", getConversations);
router.route("/conversations/:id")
    .get(getConversation)
    .patch(updateConversation)
    .delete(removeConversation);
export default router;
//# sourceMappingURL=ai.routes.js.map