// ClientService.ts
import Client from "../models/client";
import admin, { firestore } from "../config/firebase.config";
import getCurrentTimestampTunisia from "../utilities/util";
import User from "../models/user";
import {
  DynamicObject,
  FirestoreData,
  dateToFirestore,
  mapFromFirestore,
  mapToFirestore,
  mapToFirestoreT2,
  withoutNulls,
} from "../models/utilities/util";
import { Role, TypeUser } from "../utilities/enums";
import { DocumentReference } from "firebase-admin/firestore";

const db = admin.firestore();

class ClientService extends User {
  static collection = db.collection("users");

  static clientConverter: firestore.FirestoreDataConverter<Client> = {
    toFirestore(client: Client): firestore.DocumentData {
      return withoutNulls({
        userId: client.userId,
        username: client.username,
        email: client.email,
        phoneNumber: client.phoneNumber,
        photoURL: client.photoURL,
        typeUser: client.typeUser,
        joinDate: dateToFirestore(client.joinDate!),
        firstName: client.firstName,
        lastName: client.lastName,
        isBeenFreelancer: client.isBeenFreelancer,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Client {
      const data = snapshot.data();
      return new Client({
        userId: snapshot.id!,
        username: data.username,
        email: data.email,
        typeUser: data.typeUser,
        joinDate: data.joinDate,
        role: data.role,
        documentId: snapshot.ref,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        isBeenFreelancer: data.isBeenFreelancer,
      });
    },
  };

  static async updateClient(
    updatedData: DynamicObject,
    userId: string
  ): Promise<void> {
    const userRef = this.collection.doc(userId);

    try {
      if (userRef) {
        await userRef.update(this.createUserRecordData(updatedData));
      }
    } catch (e) {
      console.log(e);
    }
  }

  static async switchRole(clientId: string): Promise<void> {
    const client = await this.getClient(clientId);
    const newRole =
      client?.role === Role.Client ? Role.Freelancer : Role.Client;
    if (client?.documentId) {
      await client?.documentId
        .withConverter(this.clientConverter)
        .update({ role: newRole });
    }
  }

  static async getClient(clientId: string): Promise<Client | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.clientConverter)
        .doc(clientId)
        .get();
      const clientData = docSnapshot.data();
      if (docSnapshot.exists && clientData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return clientData as Client;
      } else {
        console.log("No such client found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      return null;
    }
  }

  static createUserRecordData(client: DynamicObject): any {
    const firestoreData = withoutNulls({
      userId: client.userId,
      username: client.username,
      email: client.email,
      typeUser: client.typeUser,
      joinDate: client.joinDate,
      role: client.role,
      firstName: client.firstName,
      lastName: client.lastName,
      photoURL: client.photoURL,
      phoneNumber: client.phoneNumber,
      fullName: client.fullName,
    });
    return firestoreData;
  }
}
export default ClientService;
