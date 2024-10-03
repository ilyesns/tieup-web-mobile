import { DocumentReference } from "firebase-admin/firestore";
import { RevisionStatus } from "../utilities/enums";
import Media from "./utilities/file";

  // Define the Revision class
export default  class Revision {
    revisionId: string;
    orderId: DocumentReference;
    revisionDate: Date;
    revisionStatus: RevisionStatus;
    details?: string;
    file?:Media;
    documentRef?:DocumentReference;
    constructor({
      revisionId,
      orderId,
      revisionDate,
      revisionStatus,
      details,
      file,
      documentRef
    }: {
      revisionId: string;
      orderId: DocumentReference;
      revisionDate: Date;
      revisionStatus: RevisionStatus;
      details?: string;
      file?: Media;
      documentRef?:DocumentReference;
    }) {
      this.revisionId = revisionId;
      this.orderId = orderId;
      this.revisionDate = revisionDate;
      this.revisionStatus = revisionStatus;
      this.details = details;
      this.file = file;
      this.documentRef = documentRef;
    }
  
    // Business logic methods will be implemented in RevisionService.
  }
  