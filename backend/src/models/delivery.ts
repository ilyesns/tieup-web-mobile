import { DocumentReference } from "firebase-admin/firestore";
import Media from "./utilities/file";

export default class Delivery {
  deliveryId: string;
  file?: Media; // Assuming this is a URL or a file identifier
  deliveryDate: Date;
  orderId: DocumentReference;
  note?: string;
  deliveryNumber: number;
  documentRef?: DocumentReference;

  constructor({
    deliveryId,
    file,
    deliveryDate,
    orderId,
    note,
    deliveryNumber,
    documentRef,
  }: {
    deliveryId: string;
    file?: Media;
    deliveryDate: Date;
    orderId: DocumentReference;
    note?: string;
    deliveryNumber: number;
    documentRef?: DocumentReference;
  }) {
    this.deliveryId = deliveryId;
    this.file = file;
    this.deliveryDate = deliveryDate;
    this.orderId = orderId;
    this.note = note;
    this.deliveryNumber = deliveryNumber;
    this.documentRef = documentRef;
  }

  // Business logic methods will be implemented in DeliveryService.
}
