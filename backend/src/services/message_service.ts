import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import Message from "../models/message";
import admin, { firestore } from "../config/firebase.config";
import { dateToFirestore, withoutNulls } from "../models/utilities/util";
import ChatService from "./chat_service";
import { MessageStatus } from "../utilities/enums";
import Media from "../models/utilities/file";
import { deleteFileFromFirebaseStorage } from "../utilities/firestorage_methods";

const db = admin.firestore();

class MessageService {
  static collection = db.collection("messages");

  static messageConverter: firestore.FirestoreDataConverter<Message> = {
    toFirestore(message: Message): firestore.DocumentData {
      return withoutNulls({
        messageId: message.messageId,
        userSent: message.userSent,
        text: message.text,
        imageUrl: message.imageUrl?.toFirestore(),
        fileUrl: message.fileUrl?.toFirestore(),
        approved: message.approved,
        chatId: message.chatId,
        createdAt: dateToFirestore(message.createdAt),
        messageStatus: message.messageStatus,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Message {
      const data = snapshot.data();
      return new Message({
        messageId: data.messageId,
        userSent: data.userSent,
        text: data.text,
        imageUrl: data.imageUrl,
        fileUrl: data.fileUrl,
        approved: data.approved,
        chatId: data.chatId,
        createdAt: data.createdAt,
        documentRef: snapshot.ref,
        messageStatus: data.messageStatus,
      });
    },
  };

  static async createMessage(messageData: {
    userSent: DocumentReference;
    text: string;
    imageUrl?: Media;
    fileUrl?: Media;
    approved: boolean;
    chatId: DocumentReference;
    createdAt: Date;
    messageStatus: MessageStatus;
  }): Promise<DocumentReference | null> {
    const messageId = this.collection
      .withConverter(this.messageConverter)
      .doc();
    const newMessage = new Message({
      messageId: messageId.id,
      userSent: messageData.userSent,
      text: messageData.text,
      imageUrl: messageData.imageUrl,
      fileUrl: messageData.fileUrl,
      approved: messageData.approved,
      chatId: messageData.chatId,
      createdAt: messageData.createdAt,
      documentRef: messageId,
      messageStatus: messageData.messageStatus,
    });

    await messageId.set(newMessage);
    return messageId;
  }
  static async getMessage(messageId: string): Promise<Message | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.messageConverter)
        .doc(messageId)
        .get();
      const messageData = docSnapshot.data();
      if (docSnapshot.exists && messageData) {
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return messageData as Message;
      } else {
        console.log("No such message found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  message:", error);
      return null;
    }
  }
  static async getAllMessagesByChatId(chatId: string): Promise<Message[] | []> {
    try {
      const chatRef = ChatService.collection.doc(chatId);
      const docSnapshot = await this.collection
        .withConverter(this.messageConverter)
        .where("chatId", "==", chatRef)
        .orderBy("createdAt", "asc") // Add orderby clause
        .get();

      if (!docSnapshot.empty) {
        const messages = docSnapshot.docs.map((doc) => doc.data()); // Convert each doc to Chat using the converter
        return messages;
      } else {
        console.log("No messages found for chat ID:", chatId);
        return [];
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  static async getAllMessagesByUserId(
    userId: DocumentReference,
    chatId: DocumentReference
  ): Promise<Message[] | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.messageConverter)
        .where("userSent", "==", userId)
        .where("chatId", "==", chatId)
        .get();

      if (!docSnapshot.empty) {
        const messages = docSnapshot.docs.map((doc) => doc.data()); // Convert each doc to Chat using the converter
        return messages;
      } else {
        console.log("No messages found for user ID:", userId.id);
        return null;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
    }
  }
  static async deleteMessage(messageId: string): Promise<void> {
    const message = await this.getMessage(messageId);
    try {
      if (message?.imageUrl) {
        deleteFileFromFirebaseStorage(message.imageUrl!.url!);
      }
      if (message?.fileUrl) {
        deleteFileFromFirebaseStorage(message.fileUrl!.url!);
      }
      await message?.documentRef?.delete();
    } catch (e) {
      console.log(e);
    }
  }

  // Additional methods for message management could be added here
}

export default MessageService;
