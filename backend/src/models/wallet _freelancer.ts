import { DocumentReference } from "firebase-admin/firestore";
import Wallet from "./wallet";

export default class WalletFreelancer extends Wallet {

    pendingClearance: number;
    earningsInMonth: number;
    activeOrdersValue: Map<number,number>;
  
    constructor(
      {
      walletId,
      userId,
      balance,
      pendingClearance=0,
      earningsInMonth=0,
      activeOrdersValue,
      documentRef,

      }:{
      walletId: string,
      userId: DocumentReference,
      balance: number,
      pendingClearance: number,
      activeOrdersValue: Map<number,number>,
      earningsInMonth: number,
      documentRef?: DocumentReference,
      }
    ) {
      super({
        userId:userId,
        walletId:walletId,
        balance:balance,
        documentRef:documentRef,
      });
      this.activeOrdersValue= activeOrdersValue;
      this.pendingClearance = pendingClearance;
      this.earningsInMonth = earningsInMonth;
    }
  
  }
  