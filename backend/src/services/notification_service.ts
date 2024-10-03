import admin, { firestore } from "firebase-admin";
import Notification from "../models/notification";
import { DocumentReference } from "firebase-admin/firestore";
import UserService from "./user_service";

const db = admin.firestore();

class NotificationService {
  private static collection = db.collection("notifications");

  static notificationConverter: firestore.FirestoreDataConverter<Notification> =
    {
      toFirestore(notification: Notification): firestore.DocumentData {
        return {
          text: notification.text,
          createdAt: notification.createdAt,
          marked: notification.marked,
          recipient: notification.recipient,
        };
      },

      fromFirestore: function (
        snapshot: firestore.QueryDocumentSnapshot<
          firestore.DocumentData,
          firestore.DocumentData
        >
      ): Notification {
        const data = snapshot.data();
        return new Notification({
          id: snapshot.id,
          text: data.text,
          createdAt: data.createdAt.toDate(), // Assuming createdAt is stored as Firestore Timestamp
          marked: data.marked,
          recipient: snapshot.ref,
        });
      },
    };

  static async create(notificationData: Notification): Promise<string> {
    try {
      const docRef = await this.collection.add(notificationData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async getById(
    notificationId: string
  ): Promise<Notification | undefined> {
    try {
      const docSnapshot = await this.collection.doc(notificationId).get();
      if (docSnapshot.exists) {
        const notificationData = docSnapshot.data();
        return new Notification({ id: docSnapshot.id, ...notificationData });
      }
      return undefined;
    } catch (error) {
      console.error("Error getting notification by ID:", error);
      throw error;
    }
  }

  static async update(
    notificationId: string,
    notificationData: Partial<Notification>
  ): Promise<void> {
    try {
      await this.collection.doc(notificationId).update(notificationData);
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  static async delete(notificationId: string): Promise<void> {
    try {
      await this.collection.doc(notificationId).delete();
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  static async getAllByRecipient(recipientId: string): Promise<Notification[]> {
    const userRef = UserService.collection.doc(recipientId);

    try {
      const querySnapshot = await this.collection
        .where("recipient", "==", userRef)
        .get();
      const notifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        const notification = new Notification({
          id: doc.id,
          text: notificationData.text,
          createdAt: notificationData.createdAt.toDate(),
          marked: notificationData.marked,
          recipient: notificationData.recipient,
        });
        notifications.push(notification);
      });
      return notifications;
    } catch (error) {
      console.error("Error getting notifications by recipient:");
      throw error;
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.collection.doc(notificationId).update({ marked: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
}

export default NotificationService;
