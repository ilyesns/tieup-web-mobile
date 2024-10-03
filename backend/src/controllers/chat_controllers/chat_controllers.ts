import { DocumentReference } from "firebase-admin/firestore";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import ChatService from "../../services/chat_service";
import Chat from "../../models/chat";
import UserService from "../../services/user_service";
import MessageService from "../../services/message_service";
import { MessageStatus } from "../../utilities/enums";
import { uploadFiles, uploadImages } from "../../utilities/functions";
import Message from "../../models/message";
import { jsonPathToDocumentRef } from "../../utilities/util";
import { Request, Response } from "express";
import ClientService from "../../services/client_service";

export default class ChatControllers {
  static async createOrGetChat(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const data: DynamicObject = req.body;
      if (!data) throw "Missing data";
      const { recipientId, senderId } = data;
      const sender = await ClientService.getClient(senderId);
      const recipient = await ClientService.getClient(recipientId);
      const chats = await ChatService.getAllChatByUserId(sender?.documentId!);
      let chatDoc = chats?.find((chat) =>
        chat.users!.some(
          (userRef) => userRef.path === recipient?.documentId!.path
        )
      );
      let result;
      if (!chatDoc) {
        result = (await ChatService.createChat({
          users: [sender?.documentId!, recipient?.documentId!],
          sender: sender?.documentId!,
          recipient: recipient?.documentId!,
          lastMessageSeenBy: [sender?.documentId!],
          lastMessageTime: new Date(),
          senderName: sender?.firstName + " " + sender?.lastName,
          recipientName: recipient?.firstName + " " + recipient?.lastName,
        }))!.id;
      } else {
        result = (await ChatService.getChat(chatDoc.chatId!))?.chatId;
      }

      res.status(200).send(result!);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
  static async checkExistsChat(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const data: DynamicObject = req.body;
      if (!data) throw "Missing data";
      const { recipientId, senderId } = data;
      const sender = await ClientService.getClient(senderId);
      const recipient = await ClientService.getClient(recipientId);
      const chats = await ChatService.getAllChatByUserId(sender?.documentId!);
      let chatDoc = chats?.find((chat) =>
        chat.users!.some(
          (userRef) => userRef.path === recipient?.documentId!.path
        )
      );
      let result;
      if (!chatDoc) {
        result = null;
      } else {
        result = (await ChatService.getChat(chatDoc.chatId!))?.chatId;
      }

      res.status(200).send(result!);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const file: Express.Multer.File = req.file as Express.Multer.File;
      const chatId: string = req.params.chatId;
      const { text, userSent } = req.body; // Access text and userSent from form data
      let newFile;
      let messageDetails;
      if (!userSent) throw new Error("Missing data");

      const userSentRef = await UserService.collection.doc(userSent);
      const chatRef = (await ChatService.getChat(chatId))?.documentRef!;
      if (file && file.mimetype.startsWith("image/")) {
        newFile = (await uploadImages([file], userSent, "chats"))[0];
        messageDetails = {
          chatId: chatRef,
          userSent: userSentRef!,
          text,
          approved: false,
          createdAt: new Date(),
          messageStatus: MessageStatus.Pending,
          imageUrl: newFile,
        };
      } else if (file) {
        newFile = (await uploadFiles([file], userSent, "chats"))[0];
        messageDetails = {
          chatId: chatRef,
          userSent: userSentRef!,
          text,
          approved: false,
          createdAt: new Date(),
          messageStatus: MessageStatus.Pending,
          fileUrl: newFile,
        };
      } else {
        messageDetails = {
          chatId: chatRef,
          userSent: userSentRef!,
          text,
          approved: false,
          createdAt: new Date(),
          messageStatus: MessageStatus.Pending,
        };
      }
      const messageRef = await MessageService.createMessage(messageDetails);

      ChatService.updateChat(chatRef, {
        lastMessageSentBy: userSentRef,
        lastMessage: text,
        lastMessageTime: messageDetails.createdAt,
        lastMessageSeenBy: [userSentRef!],
      });

      res.status(200).send({ message: "message send successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed achieve message sending",
        error: error!.toString(),
      });
    }
  }
  static async getMessagesInChat(req: Request, res: Response): Promise<void> {
    try {
      const chatId: string = req.params.chatId;
      if (!chatId) throw new Error("Missing chatId");
      const messages = await MessageService.getAllMessagesByChatId(chatId);
      const messagesWithApi = await Promise.all(
        messages.map((m) => classToApi(m))
      );

      res.status(200).json(messagesWithApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to achieve messages getting",
        error: error!.toString(),
      });
    }
  }
  static async markMessageAsViewed(req: Request, res: Response): Promise<void> {
    try {
      const data: DynamicObject = req.body;
      const chatId: string = req.params.chatId;
      const { userId } = data;

      const userRef = (await UserService.getUser(userId))?.documentId!;
      const chat = await ChatService.getChat(chatId);
      await ChatService.markAsRead(chat!, userRef);
      res.status(200).send({ message: "message mark as read successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to  mark as read message  ",
        error: error!.toString(),
      });
    }
  }

  static async deleteChat(req: Request, res: Response): Promise<void> {
    try {
      const chatId = req.params.chatId;
      const messages = await MessageService.getAllMessagesByChatId(chatId);
      messages?.forEach(
        async (m) => await MessageService.deleteMessage(m.messageId)
      );

      await ChatService.deleteChat(chatId);
      res.status(200).send({ message: "chat deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "failed to delete chat ", error: error!.toString() });
    }
  }
  static async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageId = req.params.messageId;
      console.log(messageId);
      const chatRef = (await MessageService.getMessage(messageId))?.chatId;
      const chat = new Chat({ lastMessage: "you have deleted message" });
      ChatService.updateChat(chatRef!, chat);
      await MessageService.deleteMessage(messageId);
      res.status(200).send({ message: "message deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to delete message ",
        error: error!.toString(),
      });
    }
  }
  static async getChatsByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.userId) throw new Error("Missing userId");
      const userId = req.params.userId;
      const userRef = UserService.collection.doc(userId);
      const chats = await ChatService.getAllChatByUserId(userRef);

      let chatsWithApi = chats;
      if (chats && chats?.length !== 0) {
        chatsWithApi = await Promise.all(
          chats!.map(async (chat) => {
            const otherUserRef = chat!.users!.find(
              (userRef) => userRef.id !== userId
            ); // Assuming userId is one of the users in the chat
            const otherUserData = await UserService.getUser(otherUserRef!.id!);

            const chatApi = await classToApi(chat!);
            chatApi.otherUserPhotoUrl = otherUserData!.photoURL!;
            chatApi.otherUserName = otherUserData!.username;
            return chatApi;
          })
        );
      }

      res.status(200).json(chatsWithApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to achieve chats getting",
        error: error!.toString(),
      });
    }
  }
  static async searchChat(req: Request, res: Response): Promise<void> {
    try {
      let userId = req.params.userId;
      let { term } = req.body;
      const userRef = UserService.collection.doc(userId);
      const chats = await ChatService.search(term, userRef);
      let chatsWithApi: DynamicObject[];
      if (chats && chats?.length !== 0) {
        chatsWithApi = await Promise.all(
          chats!.map(async (chat) => {
            const otherUserRef = chat!.users!.find(
              (userRef) => userRef.id !== userId
            ); // Assuming userId is one of the users in the chat
            const otherUserData = await UserService.getUser(otherUserRef!.id!);

            const chatApi = await classToApi(chat!);
            chatApi.otherUserPhotoUrl = otherUserData!.photoURL!;
            chatApi.otherUserName = otherUserData!.username;
            return chatApi;
          })
        );
      } else {
        chatsWithApi = [];
      }

      res.status(200).json(chatsWithApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get chat by searching ",
        error: error!.toString(),
      });
    }
  }
}
