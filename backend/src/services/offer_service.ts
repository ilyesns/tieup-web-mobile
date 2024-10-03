import { OfferData, Offer } from "../models/offer";
import admin, { firestore } from "../config/firebase.config";
import {
  DynamicObject,
  dateToFirestore,
  withoutNulls,
} from "../models/utilities/util";
import FreelancerService from "./freelancer_service";
import { DocumentReference } from "firebase-admin/firestore";
import { Plan } from "../models/plan";
import AlgoliaManager from "../utilities/search_algolia/algolia_manager";
import { OfferStatus } from "../utilities/enums";
import ServiceService from "./service_service";

const db = admin.firestore();

class OfferService {
  static offerConverter: firestore.FirestoreDataConverter<Offer> = {
    toFirestore(offer: Offer): firestore.DocumentData {
      return withoutNulls({
        offerId: offer.offerId,
        freelancerId: offer.freelancerId,
        title: offer.title,
        description: offer.description,
        serviceName: offer.serviceName,
        serviceId: offer.serviceId,
        subServiceName: offer.subServiceName,
        subServiceId: offer.subServiceId,
        basicPlan: offer.basicPlan?.toFirestore(),
        premiumPlan: offer.premiumPlan?.toFirestore(),
        status: offer.status,
        gallery: offer.gallery,
        createdAt: offer.createdAt,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Offer {
      const data = snapshot.data();
      return new Offer({
        offerId: data.offerId,
        freelancerId: data.freelancerId,
        title: data.title,
        description: data.description,
        serviceName: data.serviceName,
        serviceId: data.serviceId,
        subServiceName: data.subServiceName,
        subServiceId: data.subServiceId,
        basicPlan: data.basicPlan
          ? Plan.fromFirestore(data.basicPlan)
          : undefined,
        premiumPlan: data.premiumPlan
          ? Plan.fromFirestore(data.premiumPlan)
          : undefined,
        status: data.status,
        gallery: data.gallery,
        documentRef: snapshot.ref,
        createdAt: data.createdAt,
      });
    },
  };
  static collection = db.collection("offers");

  static async createOffer(
    freelancerId: DocumentReference,
    offerData: DynamicObject
  ): Promise<DocumentReference | null> {
    const offerId = this.collection.doc();
    const serviceId = ServiceService.collection.doc(offerData.serviceId);
    const subserviceId = ServiceService.collection.doc(offerData.subserviceId);
    const newOffer = new Offer({
      offerId: offerId.id,
      freelancerId: freelancerId,
      title: offerData.title,
      serviceName: offerData.serviceName,
      serviceId: serviceId,
      subServiceName: offerData.subServiceName,
      subServiceId: subserviceId,
      status: offerData.status || OfferStatus.PendingApproval,
      documentRef: offerId,
      createdAt: new Date(),
    });

    await offerId.withConverter(this.offerConverter).set(newOffer);
    return offerId;
  }

  // Method to update an existing Offer
  static async updateOffer(
    offerId: string,
    updatedData: Partial<OfferData>
  ): Promise<void> {
    const offer = this.collection.doc(offerId);
    if (!offer) throw new Error("No such offer exists!");
    const newOffer = withoutNulls(
      new Offer({ ...updatedData }).toFirestoreObject()
    );

    await offer.withConverter(this.offerConverter).update(newOffer);
  }

  // Method to delete an Offer
  static async deleteOffer(offerId: string): Promise<void> {
    const offer = await this.getOffer(offerId);
    if (!offer) throw new Error("The offer does not exist!");
    await offer.documentRef?.delete();
  }

  // Method to retrieve the details of an Offer
  static async getOffer(offerId: string): Promise<Offer | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.offerConverter)
        .doc(offerId)
        .get();
      const offerData = docSnapshot.data();
      if (docSnapshot.exists && offerData) {
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return offerData as Offer;
      } else {
        console.log("No such Offer found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  Offer:", error);
      return null;
    }
  }
  static async getOfferBy(
    freelancerId: DocumentReference
  ): Promise<Offer | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.offerConverter)
        .where("freelancerId", "==", freelancerId)
        .get();
      const offerData = docSnapshot.docs;
      if (!docSnapshot.empty && offerData) {
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return offerData[0].data() as Offer;
      } else {
        console.log("No such Offer found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  Offer:", error);
      return null;
    }
  }
  static async getAllOffersBy(
    freelancerId: DocumentReference
  ): Promise<Offer[] | []> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.offerConverter)
        .where("freelancerId", "==", freelancerId)
        .get();
      if (!docSnapshot.empty) {
        const offersData = docSnapshot.docs.map((doc) => doc.data());
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return offersData as Offer[];
      } else {
        console.log("No such Offers found!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching  Offers:", error);
      return [];
    }
  }
  static async getAllOffersByServiceId(
    serviceId: DocumentReference,
    freelancerId: DocumentReference
  ): Promise<Offer[] | []> {
    try {
      let docSnapshot;
      if (freelancerId) {
        docSnapshot = await this.collection
          .withConverter(this.offerConverter)
          .where("subServiceId", "==", serviceId)
          .where("status", "==", "active")
          .where("freelancerId", "!=", freelancerId)
          .get();
      } else {
        docSnapshot = await this.collection
          .withConverter(this.offerConverter)
          .where("subServiceId", "==", serviceId)
          .where("status", "==", "active")
          .get();
      }

      if (!docSnapshot.empty) {
        const offersData = docSnapshot.docs.map((doc) => doc.data());
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return offersData as Offer[];
      } else {
        console.log("No such Offers found!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching  Offers:", error);
      return [];
    }
  }
  static async getAllOffers(
    pageNum?: number,
    size?: number
  ): Promise<{ offers: Offer[]; totalCount: number }> {
    try {
      const offersRef = this.collection
        .withConverter(this.offerConverter)
        .where("status", "==", "active");

      const totalCountSnapshot = await offersRef.get();
      const totalCount = totalCountSnapshot.size;

      const docSnapshot = await offersRef
        .limit(size!)
        .offset(pageNum! * size!)
        .get();
      if (!docSnapshot.empty) {
        const offersData = docSnapshot.docs.map((doc) => doc.data());
        return { offers: offersData as Offer[], totalCount };
      } else {
        console.log("No offers found!");
        return { offers: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching  Offers:", error);
      return { offers: [], totalCount: 0 };
    }
  }
  static async getAllOffersAdmin(
    pageNum?: number,
    size?: number
  ): Promise<{ offers: Offer[]; totalCount: number }> {
    try {
      const offersRef = this.collection
        .withConverter(this.offerConverter)
        .where("status", "in", [
          OfferStatus.Active,
          OfferStatus.Denied,
          OfferStatus.PendingApproval,
        ]);

      const totalCountSnapshot = await offersRef.get();
      const totalCount = totalCountSnapshot.size;

      const docSnapshot = await offersRef
        .limit(size!)
        .offset(pageNum! * size!)
        .orderBy("status", "desc")
        .get();
      if (!docSnapshot.empty) {
        const offersData = docSnapshot.docs.map((doc) => doc.data());
        return { offers: offersData as Offer[], totalCount };
      } else {
        console.log("No offers found!");
        return { offers: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching  Offers:", error);
      return { offers: [], totalCount: 0 };
    }
  }
  static async updateStatus(offerId: string, status: string) {
    let offerDoc = await OfferService.collection.doc(offerId);
    if (!offerDoc) throw new Error("The offer does not exist");
    await offerDoc?.update({ status: status });
  }
  static async search(term: string): Promise<Offer[] | []> {
    const offers = await AlgoliaManager.getInstance().algoliaQuery({
      index: "offers",
      term: term,
      useCache: true,
      offerStatus: OfferStatus.Active,
    });

    return offers.map((offer) => Offer.fromAlgolia(offer));
  }
}

export default OfferService;
