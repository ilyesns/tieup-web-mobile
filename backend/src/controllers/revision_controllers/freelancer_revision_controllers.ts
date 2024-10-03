import RevisionService from "../../services/revision_service";
import { DocumentReference } from "firebase-admin/firestore";
import { RevisionStatus } from "../../utilities/enums";
import { DynamicObject } from "../../models/utilities/util";
import { uploadFiles } from "../../utilities/functions";
import OrderService from "../../services/order_service";
import Revision from "../../models/revision";

class FreelancerRevisionControllers {
  static async handleRevision(revisionId: string): Promise<void> {

    try {
      await RevisionService.updateRevisionStatus(revisionId, RevisionStatus.UnderReview);
      console.log(`Revision ${revisionId} is now under review.`);
    } catch (error) {
      console.error("Error handling revision:", error);
      throw error; // Re-throw the error for further handling
    }
  }

  static async submitRevision(data:DynamicObject,file:Express.Multer.File): Promise<void> {
    const {orderId,revisionId} = data;
    const order =await OrderService.getOrder(orderId);

    try {
        
    const newFile = (await uploadFiles([file],order?.clientId.id!,`orders`))[0];  // Guaranteed
      // Assuming completedWork is the work to be submitted, which might include file uploads or similar
      // const uploadResult = await someUploadService.upload(completedWork);

      await RevisionService.updateRevisionStatus(revisionId, RevisionStatus.Completed);
      console.log(`Revision ${revisionId} has been completed and submitted.`);
    } catch (error) {
      console.error("Error submitting revision:", error);
      throw error; // Re-throw the error for further handling
    }
  }

  static async getAllRevisionsByOrderId(data:DynamicObject):Promise<Revision[]| null>{
    const {orderId,status} = data;
    const orderRef = OrderService.collection.doc(orderId);
    return await RevisionService.getAllRevisionsByOrderIdAndStatus(orderRef, RevisionStatus.Pending);

  }

}

export default FreelancerRevisionControllers;
