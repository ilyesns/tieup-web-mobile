import Review from "../../models/review";
import { DynamicObject } from "../../models/utilities/util";
import OfferService from "../../services/offer_service";
import OrderService from "../../services/order_service";
import ReviewService from "../../services/review_service";
import UserService from "../../services/user_service";

export default class ReviewControllers {

    static async getAllReviewsByOfferId(data:DynamicObject):Promise<Review[]| null> {
        const {offerId}=data;
        const offerRef = OfferService.collection.doc(offerId);
        return await ReviewService.getAllReviewsByFieldName('offerId',offerRef);
        
    }
    static async getAllReviewsByFreelancerId(data:DynamicObject):Promise<Review[]| null> {
        const {userId}=data;
        const userRef = UserService.collection.doc(userId);
        return await ReviewService.getAllReviewsByFieldName('targetUser',userRef);

    }
    static async getAllReviewsByClientId(data:DynamicObject):Promise<Review[]| null> {
        const {userId}=data;
        const userRef = UserService.collection.doc(userId);
        return await ReviewService.getAllReviewsByFieldName('reviewer',userRef);

    }
}