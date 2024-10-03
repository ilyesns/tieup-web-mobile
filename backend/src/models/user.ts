import admin from "../config/firebase.config"; // Make sure you have initialized Firebase correctly in another file
import { Firestore, collection, addDoc } from "firebase/firestore";
import { AdminRole, Role, TypeUser } from "../utilities/enums";
import { DocumentSnapshot, DocumentReference } from "firebase-admin/firestore";
import {
  DynamicObject,
  dateFromAlgolia,
  mapFromFirestore,
} from "./utilities/util";
import Client from "./client";
import { Freelancer } from "./freelancer";

// Assuming `admin.firestore()` returns a Firestore instance
const db = admin.firestore();

// Abstract class User
class User {
  // Fields as per the class diagram
  public userId?: string;
  public role?: Role | AdminRole;
  public username?: string;
  public email?: string;
  public phoneNumber?: string;
  public photoURL?: string;
  public typeUser?: TypeUser;
  public joinDate?: Date;
  public documentId?: DocumentReference;
  public firstName?: string;
  public lastName?: string;
  constructor({
    userId,
    username,
    email,
    typeUser,
    joinDate,
    role,
    documentId,
    photoURL = undefined,
    phoneNumber = undefined,
  }: {
    userId?: string;
    username?: string;
    email?: string;
    typeUser?: TypeUser;
    role?: Role | AdminRole;
    joinDate?: Date;
    documentId?: DocumentReference;
    photoURL?: string;
    phoneNumber?: string;
  }) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.photoURL = photoURL;
    this.typeUser = typeUser;
    this.joinDate = joinDate;
    this.documentId = documentId;
  }
}
export default User;
