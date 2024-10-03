import express from "express";
import UserNotificationController from "../../controllers/user_notification_controller/user_notification_controller";

const router = express.Router();

// Route to get all notifications for a user
router.get(
  "/notifications/:userId",
  UserNotificationController.getAllNotifications
);

// Route to mark a notification as read
router.put(
  "/notifications/:id/mark-read",
  UserNotificationController.markAsRead
);

// Route to delete a notification
router.delete(
  "/notifications/:id",
  UserNotificationController.deleteNotification
);

export default router;
