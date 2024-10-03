import admin, { firestore } from '../config/firebase.config';
import { DocumentReference } from 'firebase-admin/firestore';
import { withoutNulls } from '../models/utilities/util';
import Report  from '../models/report';
import { ReportStatus } from '../utilities/enums';
const db = admin.firestore();

class ReportService {
    static collection = db.collection('reports');

    
    static  reportConverter: firestore.FirestoreDataConverter<Report> = {
        toFirestore(report: Report): firestore.DocumentData {
          return withoutNulls({
          reportId: report.reportId,
          reportedById: report.reportedById,
          category: report.category,
          description: report.description,
          status: report.status,
          creationDate: report.creationDate,
          resolutionDate:report.resolutionDate,
          resolutionDetails:report.resolutionDetails,
          });
        },
        fromFirestore: function (snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData, firestore.DocumentData>):Report {
          const data = snapshot.data();
          return new Report(
               {         
                reportId: data.reportId,
                reportedById: data.reportedById,
                category: data.category,
                description: data.description,
                status: data.status,
                creationDate: data.creationDate,
                resolutionDate:data.resolutionDate,
                resolutionDetails:data.resolutionDetails,
                documentRef:snapshot.ref,
               }       
          );
        }
      };
      

  static async createReport(reportData: {
    reportedById?: DocumentReference;
    category?: string;
    description?: string;
    status?: ReportStatus;
    creationDate?: Date;
    resolutionDate?: Date;
    resolutionDetails?: string;
  }): Promise<DocumentReference> {
    // Logic to create a new report in the database
    const newReportRef = this.collection.doc();
    await newReportRef.set({ ...reportData });
    return newReportRef; // Return the DocumentReference of the newly created report
  }

  static async deleteReport(reportId: string): Promise<void> {
    // Logic to delete the report from the database
    const reportRef = this.collection.doc(reportId);
    await reportRef.delete();
  }

  // Optionally, if you need to update reports, you can implement an update method
  static async updateReport(reportId: string, updatedData: Partial<Report>): Promise<void> {
    const reportRef = this.collection.doc(reportId);
    await reportRef.update(updatedData);
  }
}

export default ReportService;
