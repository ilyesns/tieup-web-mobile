import { AdminRole, Role, TypeUser } from "../utilities/enums";
import { DocumentSnapshot, DocumentReference } from "firebase-admin/firestore";
import {
  DynamicObject,
  dateFromAlgolia,
  mapFromFirestore,
} from "./utilities/util";

// Assuming `admin.firestore()` returns a Firestore instance

// Abstract class User
class Notification {
  // Fields as per the class diagram
  public id?: string;
  public text?: string;
  public createdAt?: Date;
  public marked?: boolean;
  public recipient?: DocumentReference;

  constructor({
    id,
    text,
    createdAt,
    marked,
    recipient,
  }: {
    id?: string;
    text?: string;
    createdAt?: Date;
    marked?: boolean;
    recipient?: DocumentReference;
  }) {
    this.id = id;
    this.text = text;
    this.createdAt = createdAt;
    this.marked = marked;
    this.recipient = recipient;
  }
}
export default Notification;
