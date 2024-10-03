import { DocumentReference } from "firebase-admin/firestore";
import WalletAdmin from "../models/admin_wallet";
import WalletService from "./wallet_service";
import admin, { firestore } from "../config/firebase.config";
import { withoutNulls } from "../models/utilities/util";
const db = admin.firestore();

export default class WalletAdminService extends WalletService {
  static walletAdminConverter: firestore.FirestoreDataConverter<WalletAdmin> = {
    toFirestore(walletAdmin: WalletAdmin): firestore.DocumentData {
      return withoutNulls({
        walletId: walletAdmin.walletId,
        userId: walletAdmin.userId,
        balance: walletAdmin.balance,
        totalRevenue: walletAdmin.totalRevenue,
        totalDepositsByClients: walletAdmin.totalDepositsByClients,
        totalWithdrawalsByFreelancers:
          walletAdmin.totalWithdrawalsByFreelancers,
        totalPendingClearance: walletAdmin.totalPendingClearance,
        earningsInMonth: walletAdmin.earningsInMonth,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): WalletAdmin {
      const data = snapshot.data();
      return new WalletAdmin({
        walletId: data.walletId,
        userId: data.userId,
        balance: data.balance,
        totalRevenue: data.totalRevenue,
        totalDepositsByClients: data.totalDepositsByClients,
        totalWithdrawalsByFreelancers: data.totalWithdrawalsByFreelancers,
        totalPendingClearance: data.totalPendingClearance,
        earningsInMonth: data.earningsInMonth,
        documentRef: snapshot.ref,
      });
    },
  };

  static async updateWalletAdmin(
    walletId: string,
    updatedData: Partial<WalletAdmin>
  ): Promise<void> {
    // Update common wallet properties
    await super.updateWallet(walletId, updatedData);

    const walletRef = this.collection.doc(walletId);

    await walletRef.update(withoutNulls(updatedData));
  }

  static async deleteWalletAdmin(walletId: string): Promise<void> {
    await super.deleteWallet(walletId);
  }
  static collection = db
    .collection("wallets")
    .withConverter(this.walletAdminConverter);

  static async getWalletAdmin(walletId: string): Promise<WalletAdmin | null> {
    // Inherited getWallet method will use the walletAdminConverter due to the redefined collection
    return super.getWallet(walletId) as Promise<WalletAdmin | null>;
  }

  static async getWalletByUserId(
    userId: DocumentReference
  ): Promise<WalletAdmin | null> {
    // Inherited getWallet method will use the walletFreelancerConverter due to the redefined collection
    return super.getWalletByUser(userId) as Promise<WalletAdmin | null>;
  }

  calcTotalRevenue() {
    // Logic to calculate total revenue
  }

  calcTotalDepositsByClients() {
    // Logic to calculate total deposits by clients
  }

  calcTotalWithdrawalsByFreelancers() {
    // Logic to calculate total withdrawals by freelancers
  }

  calcTotalPendingClearance() {
    // Logic to calculate total pending clearance
  }

  calcEarningsInMonth(monthNumber: number) {
    // Logic to calculate earnings in a specific month
  }

  viewPlatformTransactionHistory() {
    // Logic to view platform-wide transaction history
  }
}
