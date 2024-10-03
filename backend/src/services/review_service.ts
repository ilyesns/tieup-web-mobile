import { DocumentReference } from "firebase-admin/firestore";
import Review from "../models/review";
import admin, { firestore } from '../config/firebase.config';
import { withoutNulls } from "../models/utilities/util";

const db = admin.firestore();

 export default class ReviewService {
  static collection = db.collection('reviews');

  static  reviewConverter: firestore.FirestoreDataConverter<Review> = {
    toFirestore(review: Review): firestore.DocumentData {
      return withoutNulls({
      reviewId: review.reviewId,
      orderId: review.orderId,
      reviewer: review.reviewer,
      targetUser:review.targetUser,
      rating:review.rating,
      feedback:review.feedback,
      reviewDate:review.reviewDate,
      offerId:review.offerId,
      replyId:review.replyId,
      });
    },
    fromFirestore: function (snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData, firestore.DocumentData>):Review {
      const data = snapshot.data();
      return new Review(
           {         
            reviewId: data.reviewId,
            orderId: data.orderId,
            reviewer: data.reviewer,
            targetUser:data.targetUser,
            rating:data.rating,
            feedback:data.feedback,
            reviewDate:data.reviewDate,
            offerId:data.offerId,
            replyId:data.replyId,
          documentRef:snapshot.ref,
           }       
      );
    }
  };
  static async createReview(reviewData: {
    orderId?: DocumentReference;
    reviewer?: DocumentReference;
    targetUser?: DocumentReference;
    rating?: number;
    feedback?: string;
    reviewDate?: Date;
    offerId?: DocumentReference;
    replyId?: DocumentReference;
  }): Promise<DocumentReference> {
    const reviewRef = this.collection.withConverter(this.reviewConverter).doc();

    const newReview = new Review(
         {
          reviewId: reviewRef.id,
          orderId: reviewData.orderId!,
          reviewer: reviewData.reviewer!,
          targetUser:reviewData.targetUser!,
          rating:reviewData.rating!,
          feedback:reviewData.feedback!,
          reviewDate:reviewData.reviewDate!,
          offerId:reviewData.offerId!,
          replyId:reviewData.replyId,
        documentRef:reviewRef,
        });
  
      await reviewRef.set(newReview);
      return reviewRef;   
  }

  static async getReview(reviewId: string): Promise<Review | null> {
        try {
          const docSnapshot = await   this.collection.withConverter(this.reviewConverter).doc(reviewId).get();
          const reviewData = docSnapshot.data();
          if (docSnapshot.exists && reviewData) {
              // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
              return reviewData as Review;
          } else {
              console.log("No such Review found!");
              return null;
          }
      } catch (error) {
          console.error("Error fetching  Review", error);
          return null;
      }
      
  }

  static async deleteReview(reviewId: string): Promise<void> {
    const reviewRef = this.collection.doc(reviewId);
    await reviewRef.delete();
  }

  static async getAllReviewsByFieldName(fieldName: string, fieldValue: DocumentReference): Promise<Review[] | null> {
    try {
        // Validate the field name to prevent injection attacks or querying on non-existing fields
        const validFieldNames = ['offerId', 'orderId', 'targetUser','reviewer'];
        if (!validFieldNames.includes(fieldName)) {
            throw new Error("Invalid field name for querying reviews.");
        }

        const reviewRefs = await db.collection('reviews').where(fieldName, '==', fieldValue).get();
        const reviews = reviewRefs.docs.map(doc => doc.data() as Review);
        return reviews;
    } catch (error) {
        console.error(`Error getting reviews by ${fieldName}:`, error);
        return null;
    }
}
}

