// Client.ts
import User from "./user";
import { Role, TypeUser } from "../utilities/enums";
import { DocumentReference } from "firebase-admin/firestore";

class Client extends User {
  public role?: Role;
  public isBeenFreelancer?: boolean;

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
    firstName,
    lastName,
    isBeenFreelancer,
  }: {
    userId?: string;
    username?: string;
    email?: string;
    typeUser?: TypeUser;
    joinDate?: Date;
    role?: Role;
    documentId?: DocumentReference;
    photoURL?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    isBeenFreelancer?: boolean;
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
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.isBeenFreelancer = isBeenFreelancer;
  }
}

export default Client;
