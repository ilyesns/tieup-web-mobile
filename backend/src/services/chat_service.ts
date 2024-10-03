import { DocumentReference } from "firebase-admin/firestore";
import Chat from "../models/chat";
import admin, { firestore } from "../config/firebase.config";
import {
  DynamicObject,
  dateToFirestore,
  withoutNulls,
} from "../models/utilities/util";
import UserService from "./user_service";
import AlgoliaManager from "../utilities/search_algolia/algolia_manager";
const db = admin.firestore();

class ChatService {
  static collection = db.collection("chats");
  static chatConverter: firestore.FirestoreDataConverter<Chat> = {
    toFirestore(chat: Chat): firestore.DocumentData {
      return withoutNulls({
        chatId: chat.chatId,
        users: chat.users,
        sender: chat.sender,
        recipient: chat.recipient,
        lastMessage: chat.lastMessage,
        lastMessageSentBy: chat.lastMessageSentBy,
        lastMessageSeenBy: chat.lastMessageSeenBy,
        lastMessageTime: dateToFirestore(chat.lastMessageTime!),
        senderName: chat.senderName,
        recipientName: chat.recipientName,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Chat {
      const data = snapshot.data();
      return new Chat({
        chatId: snapshot.id,
        users: data.users,
        sender: data.sender,
        recipient: data.recipient,
        lastMessage: data.lastMessage,
        lastMessageSentBy: data.lastMessageSentBy,
        lastMessageSeenBy: data.lastMessageSeenBy,
        lastMessageTime: data.lastMessageTime,
        senderName: data.senderName,
        recipientName: data.recipientName,
        documentRef: snapshot.ref,
      });
    },
  };

  static async createChat(chatData: {
    users?: DocumentReference[];
    sender?: DocumentReference;
    recipient?: DocumentReference;
    lastMessage?: string;
    lastMessageSentBy?: DocumentReference;
    lastMessageSeenBy?: DocumentReference[];
    lastMessageTime?: Date;
    senderName?: string;
    recipientName?: string;
  }): Promise<DocumentReference | null> {
    try {
      const chatId = this.collection.withConverter(this.chatConverter).doc();
      const newChatId = chatId.id;
      const newChat = new Chat({
        chatId: newChatId,
        users: chatData.users,
        sender: chatData.sender,
        recipient: chatData.recipient,
        lastMessage: chatData.lastMessage,
        lastMessageSentBy: chatData.lastMessageSentBy,
        lastMessageSeenBy: chatData.lastMessageSeenBy,
        lastMessageTime: chatData.lastMessageTime,
        senderName: chatData.senderName,
        recipientName: chatData.recipientName,
        documentRef: chatId,
      });

      await chatId.set(newChat);
      return chatId;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async getChatByUserId(
    userRef: DocumentReference
  ): Promise<Chat | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.chatConverter)
        .where("users", "array-contains", userRef)
        .limit(1) // Assuming you want to fetch one chat for demonstration
        .get();
      if (!docSnapshot.empty) {
        const chatData = docSnapshot.docs[0].data();
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return chatData as Chat;
      } else {
        console.log("No such Chat found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      return null;
    }
  }
  static async getChat(chatId: string): Promise<Chat | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.chatConverter)
        .doc(chatId)
        .get();
      const chatData = docSnapshot.data();
      if (docSnapshot.exists && chatData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return chatData as Chat;
      } else {
        console.log("No such Chat found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      return null;
    }
  }

  static async getAllChatByUserId(
    userRef: DocumentReference
  ): Promise<Chat[] | []> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.chatConverter)
        .where("users", "array-contains", userRef)
        .orderBy("lastMessageTime", "desc") // Add orderby clause

        .get();
      if (!docSnapshot.empty) {
        const chats = docSnapshot.docs.map((doc) => doc.data()); // Convert each doc to Chat using the converter
        return chats;
      } else {
        console.log("No chats found for user ID:", userRef.id);
        return [];
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  }

  static async deleteChat(chatId: string): Promise<void> {
    const chat = await this.getChat(chatId);
    chat?.documentRef?.delete();
  }

  static async markAsRead(
    chat: Chat,
    userRef: DocumentReference
  ): Promise<void> {
    try {
      if (!chat) {
        console.log("Chat not found");
        return;
      }
      const readersPaths = chat.lastMessageSeenBy?.map((ref) => ref.path) || [];
      const userPath = userRef.path;
      if (!readersPaths.includes(userPath)) {
        console.log("User  marked as read successfully");
        readersPaths.push(userPath);

        const updatedReaders = readersPaths.map((path) =>
          firestore().doc(path)
        );

        await chat?.documentRef!.withConverter(this.chatConverter).update({
          lastMessageSeenBy: updatedReaders,
        });
      } else {
        console.log("User has already marked as read");
      }
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  }

  static async updateChat(
    chatRef: DocumentReference,
    chat: Partial<Chat>
  ): Promise<void> {
    const updatedChat = Chat.toFireStore(new Chat(chat));

    await chatRef.update(updatedChat);
  }

  static async search(
    term: string,
    userId: DocumentReference
  ): Promise<Chat[] | []> {
    const chats = await AlgoliaManager.getInstance().algoliaQuery({
      index: "chats",
      term: term,
      userId: userId,
      useCache: false,
    });

    return chats ? chats.map((e) => Chat.fromAlgolia(e)) : [];
  }
}

export default ChatService;
