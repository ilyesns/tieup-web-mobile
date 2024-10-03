import { DocumentReference } from "firebase-admin/firestore";
import { WithdrawalStatus } from "../utilities/enums";

export class WithdrawalOnDemand {
  // Account holder information
  public id?: string;
  public name: string;
  public userId: DocumentReference;
  public amount: string;
  public status: WithdrawalStatus;
  public accountNumber?: string;
  public contactInfo: {
    phoneNumber: string;
    email: string;
  };

  // Institutional use-only information
  public institutionalUseOnly?: {
    processedBy: string;
    dateProcessed: Date;
    additionalNotes?: string;
  };

  // Constructor to initialize the class with given data
  constructor(
    id: string,
    name: string,
    userId: DocumentReference,
    contactInfo: {
      phoneNumber: string;
      email: string;
    },
    amount: string,
    status: WithdrawalStatus,
    accountNumber?: string,
    institutionalUseOnly?: {
      processedBy: string;
      dateProcessed: Date;
      additionalNotes?: string;
    }
  ) {
    this.id = id;
    this.name = name;
    this.accountNumber = accountNumber;
    this.userId = userId;
    this.amount = amount;
    this.contactInfo = contactInfo;
    this.institutionalUseOnly = institutionalUseOnly;
    this.status = status;
  }

  public static fromDefaults({
    id,
    name,
    userId,
    contactInfo,
    amount,
    accountNumber,
  }: {
    id?: string;
    name: string;
    userId: DocumentReference;
    contactInfo: {
      phoneNumber: string;
      email: string;
    };
    amount: string;
    accountNumber?: string;
  }): WithdrawalOnDemand {
    return new WithdrawalOnDemand(
      id!,
      name,
      userId,
      contactInfo,
      amount,
      WithdrawalStatus.UNCHECKED,
      accountNumber,
      {
        processedBy: "Default Admin Processor",
        dateProcessed: new Date(),
        additionalNotes: "Processed by admin",
      }
    );
  }
}
