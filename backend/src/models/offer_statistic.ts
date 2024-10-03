import { DocumentReference } from "firebase-admin/firestore";

interface OfferStatisticData {
  offerSId?: string;
  freelancerId: DocumentReference;
  offerId: DocumentReference;
  totalMade?: number;
  clicks?: number;
  impressions?: number;
  totalRating?: number;
  numberRaters?: number;
}


 class OfferStatistic {
    offerSId?: string;
    freelancerId: DocumentReference;
    offerId: DocumentReference;
    totalMade?: number;
    clicks?: number;
    impressions?: number;
    totalRating?: number;
    numberRaters?: number;
    documentRef?:DocumentReference;
  
    constructor({
      offerSId,
      freelancerId,
      offerId,
      totalMade = 0,
      clicks = 0,
      impressions = 0,
      totalRating = 0,
      numberRaters = 0,
      documentRef
    }: {
      offerSId?: string;
      freelancerId: DocumentReference;
      offerId: DocumentReference;
      totalMade?: number;
      clicks?: number;
      impressions?: number;
      totalRating?: number;
      numberRaters?: number;
      documentRef?: DocumentReference;
    }) {
      this.freelancerId = freelancerId;
      this.offerSId = offerSId;
      this.offerSId = offerSId;
      this.offerId = offerId;
      this.totalMade = totalMade;
      this.clicks = clicks;
      this.impressions = impressions;
      this.totalRating = totalRating;
      this.numberRaters = numberRaters;
      this.documentRef = documentRef;
    }
  }
  export {OfferStatisticData , OfferStatistic}
