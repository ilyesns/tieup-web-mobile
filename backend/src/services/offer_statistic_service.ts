import  { OfferStatistic, OfferStatisticData } from "../models/offer_statistic";
import admin, { firestore } from '../config/firebase.config';
import { withoutNulls } from "../models/utilities/util";
import { DocumentReference } from "firebase-admin/firestore";
import FreelancerService from "./freelancer_service";
import OfferService from "./offer_service";
const db = admin.firestore();
class OfferStatisticService {

  static collection = db.collection('offerStatistics');

  static  offerSConverter: firestore.FirestoreDataConverter<OfferStatistic> = {
    toFirestore(offerS: OfferStatistic): firestore.DocumentData {
      return withoutNulls({
      offerSId: offerS.offerSId,
      freelancerId: offerS.freelancerId,
      offerId: offerS.offerId,
      totalMade:offerS.totalMade,
      clicks:offerS.clicks,
      impressions:offerS.impressions,
      totalRating:offerS.totalRating,
      numberRaters:offerS.numberRaters,
      });
    },
    fromFirestore: function (snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData, firestore.DocumentData>):OfferStatistic {
      const data = snapshot.data();
      return new OfferStatistic(
           {         
            offerSId: data.offerSId,
            freelancerId: data.freelancerId,
            offerId: data.offerId,
            totalMade:data.totalMade,
            clicks:data.clicks,
            impressions:data.impressions,
            totalRating:data.totalRating,
            numberRaters:data.numberRaters,
            documentRef:snapshot.ref,
           }       
      );
    }
  };
  static async createOfferStatistic(offerSData: OfferStatisticData): Promise<DocumentReference | null> {
  
    const  offerSId = this.collection.withConverter(this.offerSConverter).doc();
    const newOfferS = new OfferStatistic(
       {
        offerSId: offerSId.id,
        freelancerId: offerSData.freelancerId,
        offerId: offerSData.offerId,
        totalMade:offerSData.totalMade,
        clicks:offerSData.clicks,
        impressions:offerSData.impressions,
        totalRating:offerSData.totalRating,
        numberRaters:offerSData.numberRaters,
        documentRef:offerSId
      });

     await offerSId.set(newOfferS);
    return offerSId;   

  }

   static async deleteOfferStatistic(offerId: string): Promise<void> {
    const  offerRef = (await OfferService.getOffer(offerId))?.documentRef;
    const  offerS = await this.getOfferStatisticByOfferId(offerRef!);
    await offerS?.documentRef?.delete();
  }
    static async incrementImpressions(stat: OfferStatistic): Promise<void> {
      let impressions = stat?.impressions;
      impressions!++;

      await  stat!.documentRef!.update({impressions:impressions});

    }
  
    static async incrementTotalMade(stat: OfferStatistic): Promise<void> {
      let totalMade = stat?.totalMade;
      totalMade!++;

      await  stat!.documentRef!.update({totalMade:totalMade});
    }
    static async incrementTotalRating(stat: OfferStatistic): Promise<void> {
      let totalRating = stat?.totalRating;
      totalRating!++;

      await  stat!.documentRef!.update({totalRating:totalRating});
    }
    static async incrementClicks(stat: OfferStatistic): Promise<void> {
      let clicks = stat?.clicks;
      clicks!++;

      await  stat!.documentRef!.update({clicks:clicks});
    }
  
    static async getOfferStatistic(offerSId: string): Promise<OfferStatistic | null> {
      try {
        const docSnapshot = await   this.collection.withConverter(this.offerSConverter).doc(offerSId).get();
        const offerSData = docSnapshot.data();
        if (docSnapshot.exists && offerSData) {
            // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
            return offerSData as OfferStatistic;
        } else {
            console.log("No such OfferStatistic found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching  Offer:", error);
        return null;
    }

    }
  
    static async getOfferStatisticByOfferId(offerId: DocumentReference): Promise<OfferStatistic | null> {
      try {
        const docSnapshot = await   this.collection.withConverter(this.offerSConverter).where('offerId',"==",offerId).get();
        if (!docSnapshot.empty ) {
         let offerSData = docSnapshot.docs[0].data();
            // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
            return offerSData as OfferStatistic;
        } else {
            console.log("No such OfferStatistic found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching  Offer:", error);
        return null;
    }

    }
    static async getAllOfferStatistic(freelancerId: string): Promise<OfferStatistic[] | null> {
      try {
        const docSnapshot = await   this.collection.withConverter(this.offerSConverter).where('freelancerId',"==",freelancerId).get();
        if (!docSnapshot.empty ) {
          const offerSData = docSnapshot.docs.map(e=>e.data());
            // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
            return offerSData as OfferStatistic[];
        } else {
            console.log("No such Offer Statistic by freelancer id found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching  Offer Statistic by freelancer id :", error);
        return null;
    }

    }

  }

export default OfferStatisticService;
  