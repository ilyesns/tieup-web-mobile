import { DocumentReference } from "firebase-admin/firestore";

export default class Review {
    reviewId: string;
    orderId: DocumentReference;
    reviewer: DocumentReference;
    targetUser: DocumentReference;
    rating: number;
    feedback: string;
    reviewDate: Date;
    offerId: DocumentReference;
    replyId?:DocumentReference;
    documentRef?:DocumentReference;
  
    constructor({
      reviewId,
      orderId,
      reviewer,
      targetUser,
      rating,
      feedback,
      reviewDate,
      offerId,
      replyId,
      documentRef,

    }: {
      reviewId: string;
      orderId: DocumentReference;
      reviewer: DocumentReference;
      targetUser: DocumentReference;
      rating: number;
      feedback: string;
      reviewDate: Date;
      offerId: DocumentReference;
      documentRef: DocumentReference;
      replyId?:DocumentReference;

    }) {
      this.reviewId = reviewId;
      this.orderId = orderId;
      this.reviewer = reviewer;
      this.targetUser = targetUser;
      this.rating = rating;
      this.feedback = feedback;
      this.reviewDate = reviewDate;
      this.offerId = offerId;
      this.replyId = replyId;
      this.documentRef= documentRef;
    }
  
    // The method to view reviews will be handled by ReviewService.
  }
  