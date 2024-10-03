import { DocumentReference } from "firebase-admin/firestore";
import {
  DynamicObject,
  classToApi,
  dateFromAlgolia,
  withoutNulls,
} from "./utilities/util";
import UserService from "../services/user_service";

export default class Chat {
  chatId?: string;
  users?: DocumentReference[];
  sender?: DocumentReference;
  recipient?: DocumentReference;
  lastMessage?: string;
  lastMessageSentBy?: DocumentReference;
  lastMessageSeenBy?: DocumentReference[];
  lastMessageTime?: Date;
  senderName?: string;
  recipientName?: string;
  documentRef?: DocumentReference;

  constructor({
    chatId,
    users,
    sender,
    recipient,
    lastMessage,
    lastMessageSentBy,
    lastMessageSeenBy,
    lastMessageTime,
    senderName,
    recipientName,
    documentRef,
  }: {
    chatId?: string;
    users?: DocumentReference[];
    sender?: DocumentReference;
    recipient?: DocumentReference;
    lastMessage?: string;
    lastMessageSentBy?: DocumentReference;
    lastMessageSeenBy?: DocumentReference[];
    lastMessageTime?: Date;
    senderName?: string;
    recipientName?: string;
    documentRef?: DocumentReference;
  }) {
    this.chatId = chatId;
    this.users = users;
    this.sender = sender;
    this.recipient = recipient;
    this.lastMessage = lastMessage;
    this.lastMessageSentBy = lastMessageSentBy;
    this.lastMessageSeenBy = lastMessageSeenBy;
    this.lastMessageTime = lastMessageTime;
    this.senderName = senderName;
    this.recipientName = recipientName;
    this.documentRef = documentRef;
  }
  static toFireStore(data: DynamicObject) {
    return withoutNulls({
      chatId: data.chatId,
      users: data.users,
      sender: data.sender,
      recipient: data.recipient,
      lastMessage: data.lastMessage,
      lastMessageSentBy: data.lastMessageSentBy,
      lastMessageSeenBy: data.lastMessageSeenBy,
      lastMessageTime: data.lastMessageTime!,
      senderName: data.senderName,
      recipientName: data.recipientName,
    });
  }
  static fromAlgolia(data: DynamicObject) {
    const userIds = data.users
      .map((user: string) => user.split("/")[1])
      .map((user: string) => UserService.collection.doc(user));

    return new Chat({
      chatId: data.objectID,
      users: userIds,
      sender: data.sender,
      recipient: data.recipient,
      lastMessage: data.lastMessage,
      lastMessageSentBy: data.lastMessageSentBy,
      lastMessageSeenBy: data.lastMessageSeenBy,
      lastMessageTime: dateFromAlgolia(data.lastMessageTime),
      senderName: data.senderName,
      recipientName: data.recipientName,
      documentRef: data.path,
    });
  }
  static async ChatToApi(c: Chat) {
    return await classToApi(c);
  }
}
