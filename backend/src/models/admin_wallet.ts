import { DocumentReference } from "firebase-admin/firestore";
import Wallet from "./wallet";

export default class WalletAdmin extends Wallet {
  totalRevenue: number;
  totalDepositsByClients: number;
  totalWithdrawalsByFreelancers: number;
  totalPendingClearance: number;
  earningsInMonth: number;

  constructor({
    walletId,
    userId,
    balance,
    totalRevenue = 0,
    totalDepositsByClients = 0,
    totalWithdrawalsByFreelancers = 0,
    totalPendingClearance = 0,
    earningsInMonth = 0,
    documentRef,
  }: {
    walletId: string;
    userId: DocumentReference;
    balance: number;
    totalRevenue: number;
    totalDepositsByClients: number;
    totalWithdrawalsByFreelancers: number;
    totalPendingClearance: number;
    earningsInMonth: number;
    documentRef?: DocumentReference;
  }) {
    super({
      userId: userId,
      walletId: walletId,
      balance: balance,
      documentRef: documentRef,
    });
    this.totalRevenue = totalRevenue;
    this.totalDepositsByClients = totalDepositsByClients;
    this.totalWithdrawalsByFreelancers = totalWithdrawalsByFreelancers;
    this.totalPendingClearance = totalPendingClearance;
    this.earningsInMonth = earningsInMonth;
  }
}
