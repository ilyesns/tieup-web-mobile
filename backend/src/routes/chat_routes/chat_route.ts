import express, { Request, Response } from "express";
import { DynamicObject } from "../../models/utilities/util";
import multer from "multer";
import ChatControllers from "../../controllers/chat_controllers/chat_controllers";
import { DocumentReference } from "firebase-admin/firestore";
import { validateToken } from "../../middlewares/validate_token";
const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post("/read-create", validateToken, ChatControllers.createOrGetChat);

router.post("/check-chat", validateToken, ChatControllers.checkExistsChat);

router.post(
  "/send-message/:chatId",
  upload.single("file"),
  validateToken,
  ChatControllers.sendMessage
);
router.get("/read-messages-chat/:chatId", ChatControllers.getMessagesInChat);
router.get(
  "/read-chats/:userId",
  validateToken,
  ChatControllers.getChatsByUserId
);

router.delete("/delete-chat/:chatId", ChatControllers.deleteChat);
router.post("/mark-message-read/:chatId", ChatControllers.markMessageAsViewed);
router.delete("/delete-message/:messageId", ChatControllers.deleteMessage);

router.post("/search/:userId", ChatControllers.searchChat);
//validateToken
export default router;
