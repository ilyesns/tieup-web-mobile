import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
  DocumentReference,
} from "firebase-admin/firestore";
import admin, { firestore } from "../config/firebase.config";

import { WithdrawalOnDemand } from "../models/withdrawal_on_demand";
import { withoutNulls } from "../models/utilities/util";

const db = admin.firestore();

export class WithdrawalService {
  static withdrawalOnDemandConverter: FirestoreDataConverter<WithdrawalOnDemand> =
    {
      toFirestore(data: WithFieldValue<WithdrawalOnDemand>): DocumentData {
        return withoutNulls({
          name: data.name,
          accountNumber: data.accountNumber,
          userId: data.userId,
          amount: data.amount,
          contactInfo: data.contactInfo,
          institutionalUseOnly: data.institutionalUseOnly || {},
          status: data.status,
        });
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): WithdrawalOnDemand {
        const data = snapshot.data();
        return new WithdrawalOnDemand(
          snapshot.id,
          data.name,
          data.userId,
          data.contactInfo,
          data.amount,
          data.status,
          data.accountNumber,
          data.institutionalUseOnly
        );
      },
    };
  static collection = db
    .collection("withdrawals")
    .withConverter(WithdrawalService.withdrawalOnDemandConverter);

  // Create a new withdrawal record
  static async create(withdrawal: WithdrawalOnDemand): Promise<void> {
    const docRef = this.collection.doc();

    await docRef.set(withdrawal);
  }

  // Read a withdrawal record by document ID
  static async read(docId: string): Promise<WithdrawalOnDemand | null> {
    const docRef = this.collection.doc(docId);
    const docSnap = await docRef.get();
    return docSnap.exists! ? docSnap.data()! : null;
  }

  // Update a withdrawal record by document ID
  static async update(docId: string, updates: string): Promise<void> {
    const docRef = this.collection.doc(docId);
    await docRef.update({ status: updates });
  }

  // Delete a withdrawal record by document ID
  static async delete(docId: string): Promise<void> {
    const docRef = this.collection.doc(docId);
    await docRef.delete();
  }
  static async readAllByUserId(
    userId: DocumentReference,
    size: number,
    pageNum: number
  ): Promise<{ withdrawals: WithdrawalOnDemand[]; totalCount: number }> {
    try {
      const withdrawRef = this.collection
        .withConverter(this.withdrawalOnDemandConverter)
        .where("userId", "==", userId);

      const totalCountSnapshot = await withdrawRef.get();
      const totalCount = totalCountSnapshot.size;

      const docSnapshot = await withdrawRef
        .limit(size!)
        .offset(pageNum! * size!)
        .orderBy("institutionalUseOnly.dateProcessed", "desc")
        .get();
      if (!docSnapshot.empty) {
        const withdrawals = docSnapshot.docs.map((doc) => doc.data());
        return { withdrawals: withdrawals as WithdrawalOnDemand[], totalCount };
      } else {
        console.log("No withdrawals found!");
        return { withdrawals: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching  withdrawals:", error);
      return { withdrawals: [], totalCount: 0 };
    }
  }
  static async readAll(
    size: number,
    pageNum: number
  ): Promise<{ withdrawals: WithdrawalOnDemand[]; totalCount: number }> {
    try {
      const withdrawRef = this.collection.withConverter(
        this.withdrawalOnDemandConverter
      );

      const totalCountSnapshot = await withdrawRef.get();
      const totalCount = totalCountSnapshot.size;

      const docSnapshot = await withdrawRef
        .limit(size!)
        .offset(pageNum! * size!)
        .orderBy("institutionalUseOnly.dateProcessed", "desc")
        .get();
      if (!docSnapshot.empty) {
        const withdrawals = docSnapshot.docs.map((doc) => doc.data());
        return { withdrawals: withdrawals as WithdrawalOnDemand[], totalCount };
      } else {
        console.log("No withdrawals found!");
        return { withdrawals: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching  withdrawals:", error);
      return { withdrawals: [], totalCount: 0 };
    }
  }
}
