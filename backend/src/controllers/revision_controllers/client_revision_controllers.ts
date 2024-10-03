import { DocumentReference } from "firebase-admin/firestore";
import RevisionService from "../../services/revision_service";
import { RevisionStatus } from "../../utilities/enums";
import { DynamicObject } from "../../models/utilities/util";
import OrderService from "../../services/order_service";
import { uploadFiles } from "../../utilities/functions";
import Revision from "../../models/revision";


export default class ClientRevisionControllers {

    
  static async requestRevision(data:DynamicObject,file:Express.Multer.File): Promise<DocumentReference | null> {
    const {orderId,details} = data;

    const order =await OrderService.getOrder(orderId);
    const revisionDate = new Date();
    const revisionStatus = RevisionStatus.Pending;

    const newFile = (await uploadFiles([file],order?.clientId.id!,`orders`))[0];  // Guaranteed
    

    try {
      // Create a new revision with the given details and file
      return await RevisionService.createRevision({
        orderId:order?.documentRef!,
        revisionDate,
        revisionStatus,
        details,
        file:newFile,
      });
    } catch (error) {
      console.error("Error requesting revision:", error);
      return null;
    }
  }

  static async markRevisionComplete(data: DynamicObject): Promise<void> {
    const {revisionId}=data;
    // Set the revision status to completed
    const newStatus = RevisionStatus.Completed;

    try {
      // Update the revision status to completed
      await RevisionService.updateRevisionStatus(revisionId, newStatus);
    } catch (error) {
      console.error("Error marking revision as complete:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  static async getAllRevisionsByOrderId(data:DynamicObject):Promise<Revision[]| null>{
    const {orderId,status} = data;
    const orderRef = OrderService.collection.doc(orderId);
    return await RevisionService.getAllRevisionsByOrderIdAndStatus(orderRef, RevisionStatus.UnderReview);

  }

}