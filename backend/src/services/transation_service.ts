import { FirestoreDataConverter } from "firebase-admin/firestore";
import Transaction from "../models/transaction";
import { TransactionType } from "../utilities/enums";
import admin, { firestore } from '../config/firebase.config';

const db = admin.firestore();

class TransactionService {

 static  transactionConverter: FirestoreDataConverter<Transaction> = {
    toFirestore(transaction: Transaction): FirebaseFirestore.DocumentData {
      return {
        transactionId: transaction.transactionId,
        walletId: transaction.walletId, // Assuming walletId is stored as a reference
        userId: transaction.userId, // Assuming userId is stored as a reference
        amount: transaction.amount,
        type: transaction.type,
        adminFee: transaction.adminFee,
        paymentStatus: transaction.paymentStatus,
        orderId: transaction.orderId, // Assuming orderId is stored as a string
        timestamp: transaction.timestamp, // Convert Date to Firestore Timestamp if needed
        description: transaction.description,
        platformName: transaction.platformName,
      };
    },
    fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot,
    ): Transaction {
      const data = snapshot.data()!;
      return new Transaction({
        transactionId: data.transactionId,
        walletId: data.walletId, // Convert Firestore reference to appropriate type if needed
        userId: data.userId, // Convert Firestore reference to appropriate type if needed
        amount: data.amount,
        type: data.type as TransactionType,
        adminFee: data.adminFee,
        paymentStatus: data.paymentStatus,
        orderId: data.orderId,
        timestamp: data.timestamp.toDate(), 
        description: data.description,
        platformName: data.platformName,
        documentRef:snapshot.ref,
      });
    }
  };

  static collection = db.collection('transactions').withConverter(this.transactionConverter);

  static async getTransactionHistory(walletId: string, startDate: Date, endDate: Date): Promise<Transaction[] | null> {
    const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
    const endTimestamp = admin.firestore.Timestamp.fromDate(endDate);

    const snapshot = await this.collection
      .where('walletId', '==', walletId)
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<=', endTimestamp)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  
  static async filterTransactions(walletId: string, type: TransactionType, status: boolean): Promise<Transaction[]> {
    const snapshot = await this.collection
      .where('walletId', '==', walletId)
      .where('type', '==', type)
      .where('paymentStatus', '==', status)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  static async getTransactionByOrderId(orderId: string): Promise<Transaction | null> {
    const snapshot = await this.collection
      .where('orderId', '==', orderId)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    } else {
      return null;
    }
  }

  static async getAllTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const userRef = db.collection('users').doc(userId); // Assuming userIds are stored as document references
    const snapshot = await this.collection
      .where('userId', '==', userRef)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }
  }
  
  export default TransactionService;
  