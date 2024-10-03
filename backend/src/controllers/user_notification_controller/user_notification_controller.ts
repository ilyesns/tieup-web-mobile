import { Request, Response } from "express";
import NotificationService from "../../services/notification_service";
import Notification from "../../models/notification";
import { classToApi } from "../../models/utilities/util";

class UserNotificationController {
  static async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      // Assuming you have user authentication and can get user ID from the request
      const userId = req.params.userId; // Get user ID from authentication middleware
      // Get all notifications for the user
      if (userId) {
        const notifications = await NotificationService.getAllByRecipient(
          userId
        );
        const notificationsWithApi = await Promise.all(
          notifications!.map(async (n) => await classToApi(n))
        );
        res.status(200).json(notificationsWithApi);
      }
    } catch (error) {
      console.error("Error getting notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const notificationId = req.params.id;

      // Mark the notification as read
      await NotificationService.markAsRead(notificationId);

      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationId = req.params.id;

      // Delete the notification
      await NotificationService.delete(notificationId);

      res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default UserNotificationController;
