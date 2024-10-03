import { DocumentReference } from "firebase-admin/firestore";
import Wallet from "../models/wallet";
import { withoutNulls } from "../models/utilities/util";
import admin, { firestore } from "../config/firebase.config";

const db = admin.firestore();

export default class WalletService {
  static walletConverter: firestore.FirestoreDataConverter<Wallet> = {
    toFirestore(wallet: Wallet): firestore.DocumentData {
      return withoutNulls({
        walletId: wallet.walletId,
        userId: wallet.userId,
        balance: wallet.balance,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Wallet {
      const data = snapshot.data();
      return new Wallet({
        walletId: data.walletId,
        userId: data.userId,
        balance: data.balance,
        documentRef: snapshot.ref,
      });
    },
  };

  static async createWallet(walletData: {
    userId: DocumentReference;
    balance: number;
  }): Promise<DocumentReference | null> {
    const walletRef = this.collection.withConverter(this.walletConverter).doc();

    const newWallet = new Wallet({
      walletId: walletRef.id,
      userId: walletData.userId,
      balance: walletData.balance,
      documentRef: walletRef,
    });

    await walletRef.set(newWallet);
    return walletRef;
  }

  static collection = db
    .collection("wallets")
    .withConverter(this.walletConverter);

  static async updateWallet(
    walletId: string,
    updatedData: Partial<Wallet>
  ): Promise<void> {
    const walletRef = this.collection.doc(walletId);
    await walletRef.update(withoutNulls(updatedData));
  }

  static async deleteWallet(walletId: string): Promise<void> {
    const walletRef = this.collection.doc(walletId);
    await walletRef.delete();
  }

  static addFunds(wallet: Wallet, amount: number): void {}

  static withdrawFunds(wallet: Wallet, amount: number): void {}

  static async getWallet(walletId: string): Promise<Wallet | null> {
    const walletRef = this.collection.doc(walletId);
    const walletDoc = await walletRef.get();
    if (!walletDoc.exists) {
      console.log("No such wallet!");
      return null;
    } else {
      return walletDoc.data() as Wallet;
    }
  }
  static async getWalletByUser(
    userId: DocumentReference
  ): Promise<Wallet | null> {
    const wallet = await this.collection.where("userId", "==", userId).get();
    if (!wallet.empty && wallet.docs.length !== 0) {
      const walletDoc = wallet.docs[0].data();
      return walletDoc;
    } else {
      return null;
    }
  }
}
