import { DocumentReference } from "firebase-admin/firestore";
import { AdminRole, TypeUser } from "../utilities/enums";
import User from "./user";
import { DynamicObject } from "./utilities/util";

class Admin extends User {
  adminId?: string;
  role?: AdminRole;

  constructor({
    userId,
    username,
    email,
    typeUser,
    joinDate,
    role,
    documentId,
    photoURL,
    phoneNumber,
    adminId,
  }: {
    userId?: string;
    adminId?: string;
    username: string;
    email: string;
    typeUser: TypeUser;
    joinDate: Date;
    role: AdminRole;
    documentId: DocumentReference;
    photoURL?: string;
    phoneNumber?: string;
  }) {
    super({
      userId,
      username,
      email,
      typeUser,
      joinDate,
      photoURL,
      phoneNumber,
      documentId,
    });
    this.adminId = adminId;
    this.role = role;
  }
}
