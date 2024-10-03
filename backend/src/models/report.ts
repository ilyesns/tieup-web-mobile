import { DocumentReference } from "firebase-admin/firestore";
import { ReportStatus } from "../utilities/enums";
import { firestore } from "../config/firebase.config";
import { withoutNulls } from "./utilities/util";


class Report {
  reportId?: string;
  reportedById?: DocumentReference;
  category?: string;
  description?: string;
  status?: ReportStatus;
  creationDate?: Date;
  resolutionDate?: Date;
  resolutionDetails?: string;
  documentRef?: DocumentReference;

  constructor({
    reportId,
    reportedById,
    category,
    description,
    status,
    creationDate,
    resolutionDate,
    resolutionDetails,
    documentRef
  }: {
    reportId?: string;
    reportedById?: DocumentReference;
    category?: string;
    description?: string;
    status?: ReportStatus;
    creationDate?: Date;
    resolutionDate?: Date;
    resolutionDetails?: string;
    documentRef?: DocumentReference;
  }) {
    this.reportId = reportId;
    this.reportedById = reportedById;
    this.category = category;
    this.description = description;
    this.status = status;
    this.creationDate = creationDate;
    this.resolutionDate = resolutionDate;
    this.resolutionDetails = resolutionDetails;
    this.documentRef = documentRef;
  }

  toFirestoreObject() {
    return withoutNulls({
    reportId: this.reportId,
    reportedById: this.reportedById,
    category: this.category,
    description: this.description,
    status: this.status,
    creationDate: this.creationDate,
    resolutionDate:this.resolutionDate,
    resolutionDetails:this.resolutionDetails,
    });
  }
}

export default Report;
