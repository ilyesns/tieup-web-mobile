import WalletFreelancer from "../models/wallet _freelancer";
import WalletService from "./wallet_service";
import admin, { firestore } from "../config/firebase.config";
import { withoutNulls } from "../models/utilities/util";
import { DocumentReference } from "firebase-admin/firestore";

const db = admin.firestore();

export default class WalletFreelancerService extends WalletService {
  static walletFreelancerConverter: firestore.FirestoreDataConverter<WalletFreelancer> =
    {
      toFirestore(walletFreelancer: WalletFreelancer): firestore.DocumentData {
        return withoutNulls({
          walletId: walletFreelancer.walletId,
          userId: walletFreelancer.userId,
          balance: walletFreelancer.balance,
          pendingClearance: walletFreelancer.pendingClearance,
          earningsInMonth: walletFreelancer.earningsInMonth,
          activeOrdersValue: walletFreelancer.activeOrdersValue,
        });
      },
      fromFirestore: function (
        snapshot: firestore.QueryDocumentSnapshot<
          firestore.DocumentData,
          firestore.DocumentData
        >
      ): WalletFreelancer {
        const data = snapshot.data();
        return new WalletFreelancer({
          walletId: data.walletId,
          userId: data.userId,
          balance: data.balance,
          pendingClearance: data.pendingClearance,
          earningsInMonth: data.earningsInMonth,
          activeOrdersValue: data.activeOrdersValue,
          documentRef: snapshot.ref,
        });
      },
    };

  static collection = db
    .collection("wallets")
    .withConverter(this.walletFreelancerConverter);

  static async updateWalletFreelancer(
    walletId: string,
    updatedData: Partial<WalletFreelancer>
  ): Promise<void> {
    // Update common wallet properties
    await super.updateWallet(walletId, updatedData);

    const walletRef = this.collection.doc(walletId);
    const freelancerSpecificData = {
      pendingClearance: updatedData.pendingClearance,
      earningsInMonth: updatedData.earningsInMonth,
      activeOrdersValue: updatedData.activeOrdersValue,
      balance: updatedData.balance,
    };
    await walletRef.update(withoutNulls(freelancerSpecificData));
  }

  static async deleteWalletFreelancer(walletId: string): Promise<void> {
    await super.deleteWallet(walletId);
  }
  static async getWallet(walletId: string): Promise<WalletFreelancer | null> {
    // Inherited getWallet method will use the walletFreelancerConverter due to the redefined collection
    return super.getWallet(walletId) as Promise<WalletFreelancer | null>;
  }
  static async getWalletByUserId(
    userId: DocumentReference
  ): Promise<WalletFreelancer | null> {
    // Inherited getWallet method will use the walletFreelancerConverter due to the redefined collection
    return super.getWalletByUser(userId) as Promise<WalletFreelancer | null>;
  }
}
