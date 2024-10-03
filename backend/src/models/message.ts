import { DocumentReference } from "firebase-admin/firestore";
import { MessageStatus } from "../utilities/enums";
import Media from "./utilities/file";

export default class Message {
  messageId: string;
  userSent: DocumentReference;
  text: string;
  imageUrl?: Media;
  fileUrl?: Media;
  approved: boolean;
  messageStatus: MessageStatus;
  chatId: DocumentReference;
  createdAt: Date;
  documentRef?:DocumentReference;
  constructor({
    messageId,
    userSent,
    text,
    imageUrl,
    fileUrl,
    approved = false,
    chatId,
    createdAt,
    documentRef,
    messageStatus = MessageStatus.Pending,
  }: {
    messageId: string;
    userSent: DocumentReference;
    text: string;
    imageUrl?: Media;
    fileUrl?: Media;
    approved: boolean;
    chatId: DocumentReference;
    createdAt: Date;
    documentRef?:DocumentReference;
    messageStatus:MessageStatus
  }) {
    this.messageId = messageId;
    this.userSent = userSent;
    this.text = text;
    this.imageUrl = imageUrl;
    this.fileUrl = fileUrl;
    this.approved = approved;
    this.chatId = chatId;
    this.createdAt = createdAt;
    this.documentRef = documentRef;
    this.messageStatus = messageStatus;
  }

  // The actual methods to send and delete messages will be moved to MessageService.
}
