import { DocumentReference } from "firebase-admin/firestore";
import { TransactionType } from "../utilities/enums";

class Transaction {
    transactionId: string;
    walletId: DocumentReference;
    userId: DocumentReference;
    amount: number;
    type: TransactionType;
    adminFee: number;
    paymentStatus: boolean;
    orderId: string;
    timestamp: Date;
    description: string;
    platformName: string;
    documentRef?:DocumentReference;
  
    constructor({
      transactionId,
      walletId,
      userId,
      amount,
      type,
      adminFee,
      paymentStatus,
      orderId,
      timestamp,
      description,
      platformName,
      documentRef,
    }: {
      transactionId: string;
      walletId: DocumentReference;
      userId: DocumentReference;
      amount: number;
      type: TransactionType;
      adminFee: number;
      paymentStatus: boolean;
      orderId: string;
      timestamp: Date;
      description: string;
      platformName: string;
      documentRef?:DocumentReference;

    }) {
      this.transactionId = transactionId;
      this.walletId = walletId;
      this.userId = userId;
      this.amount = amount;
      this.type = type;
      this.adminFee = adminFee;
      this.paymentStatus = paymentStatus;
      this.orderId = orderId;
      this.timestamp = timestamp;
      this.description = description;
      this.platformName = platformName;
      this.documentRef = documentRef;
    }
  
    // Methods like process, validate, rollback would be here
    // Methods like getTransactionHistory and filterTransactions would likely be in a TransactionService class
  }
  
  export default Transaction;
  