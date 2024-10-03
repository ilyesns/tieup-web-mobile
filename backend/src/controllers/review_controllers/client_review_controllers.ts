
import { DocumentReference } from "firebase-admin/firestore";
import ReviewService from "../../services/review_service";
import Review from "../../models/review";
import { DynamicObject } from "../../models/utilities/util";
import UserService from "../../services/user_service";
import OfferService from "../../services/offer_service";
import OrderService from "../../services/order_service";

 class ClientReviewControllers {
  static async addReview(data: DynamicObject): Promise<DocumentReference> {
    const {reviewer,targetUser,rating,feedback,offerId, orderId}=data;
    // The reviewDate is set at the time of creating the review
    const reviewerRef = UserService.collection.doc(reviewer);
    const targetUserRef = UserService.collection.doc(targetUser);
    const offerRef = OfferService.collection.doc(offerId);
    const orderRef = OrderService.collection.doc(orderId);
    const reviewDate = new Date();
    return await ReviewService.createReview({
    feedback,
    offerId:offerRef!,
    orderId:orderRef!,
    rating,
    reviewer:reviewerRef,
    targetUser:targetUserRef,
      reviewDate,
    });
  }
}

export default ClientReviewControllers;
