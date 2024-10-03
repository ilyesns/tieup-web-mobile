import { DocumentReference } from "firebase-admin/firestore";
import ReviewService from "../../services/review_service";
import Review from "../../models/review";
import { DynamicObject } from "../../models/utilities/util";
import ClientReviewControllers from "./client_review_controllers";

class FreelancerReviewControllers {
  // Allows a freelancer to reply to a review
  static async replyReview(data:DynamicObject): Promise<void> {
    const {reviewId,replyText,targetUser,reviewer,rating,feedback,offerId,orderId}=data;
    const reviewRef = ReviewService.collection.doc(reviewId);
    const replyRef =  await ClientReviewControllers.addReview(
     {reviewer:reviewId,
      targetUser:targetUser,
      rating,
      feedback,
      offerId,
      orderId}
    );

    try {
      const reviewRef = ReviewService.collection.doc(reviewId);
      
      await reviewRef.update({ replyId:replyRef });
    } catch (error) {
      console.error("Error replying to the review:", error);
      throw error; // You may want to handle this error more gracefully
    }
  }

  
}

export default FreelancerReviewControllers;
