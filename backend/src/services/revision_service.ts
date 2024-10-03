import { DocumentReference } from "firebase-admin/firestore";
import Revision from "../models/revision";
import { RevisionStatus } from "../utilities/enums";

import admin, { firestore } from '../config/firebase.config';
import { withoutNulls } from "../models/utilities/util";
import Media from "../models/utilities/file";

const db = admin.firestore();
export default class RevisionService {
  static collection = db.collection('revisions');

  
  static  revisionConverter: firestore.FirestoreDataConverter<Revision> = {
    toFirestore(revision: Revision): firestore.DocumentData {
      return withoutNulls({
      revisionId: revision.revisionId,
      orderId: revision.orderId,
      revisionDate: revision.revisionDate,
      revisionStatus:revision.revisionStatus,
      details:revision.details,
      file:revision.file?.toFirestore(),
     
      });
    },
    fromFirestore: function (snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData, firestore.DocumentData>):Revision {
      const data = snapshot.data();
      return new Revision(
           {         
          revisionId: data.revisionId,
          orderId: data.orderId,
          revisionDate: data.revisionDate,
          revisionStatus:data.revisionStatus,
          details:data.details,
          file:data.file?.toFirestore(),
          documentRef:snapshot.ref,
           }       
      );
    }
  };

    static async createRevision(revisionData: {
      orderId: DocumentReference;
      revisionDate: Date;
      revisionStatus: RevisionStatus;
      details?: string;
      file?:Media
    }): Promise<DocumentReference | null> {
      const revisionRef = this.collection.withConverter(this.revisionConverter).doc();
      const newRevision = new Revision({
        revisionId: revisionRef.id,
        orderId: revisionData.orderId,
        revisionDate: revisionData.revisionDate,
        revisionStatus:revisionData.revisionStatus,
        details:revisionData.details,
        file:revisionData.file,
        documentRef:revisionRef,
      });
      
      await revisionRef.set(newRevision);
      return revisionRef;   
    }
  
    static async updateRevisionStatus(revisionId: string, newStatus: RevisionStatus): Promise<void> {
      const revision = await this.getRevision(revisionId);

      await revision?.documentRef?.withConverter(this.revisionConverter).update({revisionStatus:newStatus});

    }
  
  static async getRevision(revisionId: string): Promise<Revision | null> {
        try {
          const docSnapshot = await   this.collection.withConverter(this.revisionConverter).doc(revisionId).get();
          const revisionData = docSnapshot.data();
          if (docSnapshot.exists && revisionData) {
              // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
              return revisionData as Revision;
          } else {
              console.log("No such Revision found!");
              return null;
          }
      } catch (error) {
          console.error("Error fetching  Revision", error);
          return null;
      }
      
  }

  
  static async getAllRevisionsByOrderIdAndStatus(orderId: DocumentReference, status: RevisionStatus): Promise<Revision[]> {
    const revisions: Revision[] = [];
    try {
      const querySnapshot = await this.collection
        .where('orderId', '==', orderId)
        .where('revisionStatus', '==', status)
        .get();

      querySnapshot.forEach((doc) => {
        const revision = doc.data() as Revision;
        revisions.push(revision);
      });
      
      return revisions;
    } catch (error) {
      console.error("Error getting revisions:", error);
      throw error; // You may want to handle this error more gracefully
    }
  }
    
  
  }
  