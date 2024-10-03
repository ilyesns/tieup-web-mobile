import { Plan, planData } from "../models/plan";
import OfferService from "./offer_service";
import admin from "../config/firebase.config";

export default class PlanService {
  static async createPlan(offerId: string, planData: planData): Promise<void> {
    const offerRef = OfferService.collection.doc(offerId);
    const plan = new Plan({ ...planData }).toFirestore();
    const type = planData.planType;

    await offerRef.set({ [`${type}`]: plan }, { merge: true });
  }

  static async updatePlan(
    offerId: string,
    updatedData: planData,
    type: string
  ): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    let oldPlanData;
    if (type === "basicPlan") {
      oldPlanData = Plan.fromFirestore(offer?.basicPlan!);
    } else {
      oldPlanData = Plan.fromFirestore(offer?.premiumPlan!);
    }
    const updatedPlan = Plan.mergePlans(oldPlanData, updatedData).toFirestore();

    // Create a new plan instance with the merged data
    if (type === "basicPlan") {
      await offer?.documentRef!.set(
        { basicPlan: updatedPlan },
        { merge: true }
      );
    } else {
      await offer?.documentRef!.set(
        { premiumPlan: updatedPlan },
        { merge: true }
      );
    }
  }

  static async deletePlan(offerId: string, type: string): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    // Assuming plan is a subfield of the offer document and we want to remove it

    if (type === "basicPlan") {
      await offer?.documentRef!.update({
        basicPlan: admin.firestore.FieldValue.delete(),
      });
    } else {
      await offer?.documentRef!.update({
        premiumPlan: admin.firestore.FieldValue.delete(),
      });
    }
  }
}
