import {
  DynamicObject,
  FirestoreData,
  dateToFirestore,
  mapToFirestore,
  withoutNulls,
} from "../models/utilities/util";
import { AdminRole, Role, TypeUser } from "../utilities/enums";
import admin, { firestore } from "../config/firebase.config";
import User from "../models/user";
import { DocumentReference } from "firebase-admin/firestore";
import Client from "../models/client";
import AlgoliaManager from "../utilities/search_algolia/algolia_manager";
import ClientService from "./client_service";
import FreelancerService from "./freelancer_service";
import { Freelancer } from "../models/freelancer";

const db = admin.firestore();

export default abstract class UserService {
  static collection = db.collection("users");

  static userConverter: firestore.FirestoreDataConverter<User> = {
    toFirestore(user: User): firestore.DocumentData {
      return withoutNulls({
        userId: user.userId,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        typeUser: user.typeUser,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,

        joinDate: dateToFirestore(user!.joinDate!),
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): User {
      const data = snapshot.data();
      return new User({
        userId: data.userId,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL,
        typeUser: data.typeUser,
        joinDate: data.joinDate,
        role: data.role as Role | AdminRole,
        documentId: snapshot.ref,
      });
    },
  };

  static async getUser(userId: string): Promise<User | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.userConverter)
        .doc(userId)
        .get();
      const userData = docSnapshot.data();
      if (docSnapshot.exists && userData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return userData as User;
      } else {
        console.log("No such User found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching User:", error);
      return null;
    }
  }

  static async getAdmin(): Promise<User | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.userConverter)
        .where("typeUser", "==", TypeUser.Admin)
        .get();
      const userData = docSnapshot.docs[0].data();
      if (!docSnapshot.empty && userData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return userData as User;
      } else {
        console.log("No such User found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching User:", error);
      return null;
    }
  }

  static async getEmailVerificationLink(email: string): Promise<string> {
    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email as string, {
        url: "https://tieup.net/personal_info?step=account_security",
      });
    return verificationLink;
  }

  static async createUser(clientData: {
    userUid: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    typeUser: TypeUser;
    role: Role;
    photoURL?: string;
    phoneNumber?: string;
  }): Promise<DocumentReference | null> {
    const userId = this.collection
      .withConverter(this.userConverter)
      .doc(clientData.userUid);
    const newUser = new Client({
      userId: clientData.userUid,
      username: clientData.username,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      email: clientData.email,
      typeUser: clientData.typeUser,
      joinDate: new Date(),
      role: clientData.role,
      documentId: userId,
      photoURL: clientData.photoURL,
      phoneNumber: clientData.phoneNumber,
    });

    await userId.set(newUser);
    return userId;
  }
  static async delete(data: DynamicObject): Promise<void> {
    const user = await UserService.getUser(data.userId);
    await user?.documentId?.delete();
  }
  static async changePassword(data: DynamicObject): Promise<void> {
    const { newPassword, userId } = data.newPassword; // The new password sent in the request body

    if (!newPassword) {
      throw new Error("New password is required.");
    }

    try {
      await admin.auth().updateUser(userId, {
        password: newPassword,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password.");
    }
  }
  static async search(term: string): Promise<User[] | []> {
    const users = await AlgoliaManager.getInstance().algoliaQuery({
      index: "users",
      term: term,
      useCache: true,
    });

    return users;
  }
  static async getAllUsers(
    role: Role,
    page: number,
    pageSize: number
  ): Promise<{ users: User[]; totalCount: number }> {
    try {
      const usersRef = this.collection
        .withConverter(
          role === Role.Client
            ? FreelancerService.clientConverter
            : FreelancerService.freelancerConverter
        )
        .where("role", "==", role);

      // Fetch total count of users
      const totalCountSnapshot = await usersRef.get();
      const totalCount = totalCountSnapshot.size;

      // Fetch users for the current page
      const docSnapshot = await usersRef
        .orderBy("joinDate", "desc")
        .limit(pageSize)
        .offset(page * pageSize)
        .get();

      if (!docSnapshot.empty) {
        const usersData = docSnapshot.docs.map((doc) => doc.data());
        return { users: usersData as User[], totalCount };
      } else {
        console.log("No users found!");
        return { users: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], totalCount: 0 };
    }
  }
  static async getAllUsersNumber(): Promise<number> {
    try {
      const usersRef = this.collection.withConverter(UserService.userConverter);

      // Fetch total count of users
      const totalCountSnapshot = await usersRef.get();
      const totalCount = totalCountSnapshot.size;

      return totalCount;
    } catch (error) {
      console.error("Error fetching users:", error);
      return 0;
    }
  }
  createUserRecordData({
    userId,
    username,
    email,
    typeUser,
    joinDate,
    role,
    photoURL,
    phoneNumber,
  }: {
    userId?: string;
    username?: string;
    email?: string;
    typeUser?: TypeUser;
    joinDate?: Date;
    role?: Role;
    photoURL?: string;
    phoneNumber?: string;
  }): FirestoreData {
    const firestoreData = mapToFirestore(
      withoutNulls({
        userId: userId,
        username: username,
        email: email,
        typeUser: typeUser,
        joinDate: joinDate,
        role: role,
        photoURL: photoURL,
        phoneNumber: phoneNumber,
      })
    );

    return firestoreData;
  }
}
