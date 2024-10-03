import { DocumentReference } from "firebase-admin/firestore";


export default class Wallet {
  walletId: string;
  userId: DocumentReference;
  balance: number;
  documentRef?: DocumentReference;

  constructor({
    walletId,
    userId,
    balance = 0,
    documentRef,
  }: {
    walletId: string;
    userId: DocumentReference;
    balance?: number;
    documentRef?: DocumentReference;
  }) {
    this.walletId = walletId;
    this.userId = userId;
    this.balance = balance;
    this.documentRef = documentRef;
  }

}
