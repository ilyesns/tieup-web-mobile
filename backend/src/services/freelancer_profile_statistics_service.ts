import { DocumentReference } from "firebase-admin/firestore";
import FreelancerProfileStatistics from "../models/freelancer_profile_statistics";
import admin, { firestore } from "../config/firebase.config";
import { dateToFirestore, withoutNulls } from "../models/utilities/util";
import UserService from "./user_service";

const db = admin.firestore();

class FreelancerProfileStatisticsService {
  static collection = db.collection("freelancerProfileStatistics");
  static freelancerPSConverter: firestore.FirestoreDataConverter<FreelancerProfileStatistics> =
    {
      toFirestore(
        freelancerPrfSts: FreelancerProfileStatistics
      ): firestore.DocumentData {
        return withoutNulls({
          freelancerId: freelancerPrfSts.freelancerId,
          sellerLevel: freelancerPrfSts.sellerLevel,
          nextEvaluationDate: dateToFirestore(
            freelancerPrfSts.nextEvaluationDate!
          ),
          responseTime: freelancerPrfSts.responseTime,
          orderCompletionRate: freelancerPrfSts.orderCompletionRate,
          onTimeDeliveryRate: freelancerPrfSts.onTimeDeliveryRate,
          positiveRatingPercentage: freelancerPrfSts.positiveRatingPercentage,
        });
      },
      fromFirestore: function (
        snapshot: firestore.QueryDocumentSnapshot<
          firestore.DocumentData,
          firestore.DocumentData
        >
      ): FreelancerProfileStatistics {
        const data = snapshot.data();
        return new FreelancerProfileStatistics({
          freelancerId: data.freelancerId,
          sellerLevel: data.sellerLevel,
          nextEvaluationDate: data.nextEvaluationDate,
          responseTime: data.responseTime,
          orderCompletionRate: data.orderCompletionRate,
          onTimeDeliveryRate: data.onTimeDeliveryRate,
          positiveRatingPercentage: data.positiveRatingPercentage,
          documentRef: snapshot.ref,
        });
      },
    };
  static async createStatistics(statisticsData: {
    freelancerId?: DocumentReference;
    sellerLevel?: string;
    nextEvaluationDate?: Date;
    responseTime?: number;
    orderCompletionRate?: number;
    onTimeDeliveryRate?: number;
    positiveRatingPercentage?: number;
  }): Promise<FreelancerProfileStatistics | null> {
    const statisticId = this.collection
      .withConverter(this.freelancerPSConverter)
      .doc();
    const newStatisticId = statisticId.id;
    const newStatistic = new FreelancerProfileStatistics({
      freelancerId: statisticsData.freelancerId!,
      sellerLevel: statisticsData.sellerLevel!,
      nextEvaluationDate: statisticsData.nextEvaluationDate,
      responseTime: statisticsData.responseTime,
      orderCompletionRate: statisticsData.orderCompletionRate,
      onTimeDeliveryRate: statisticsData.onTimeDeliveryRate,
      positiveRatingPercentage: statisticsData.positiveRatingPercentage,
      documentRef: statisticId,
    });

    await statisticId.set(newStatistic);
    return newStatistic;
  }

  static async getStatistics(
    freelancerId: DocumentReference
  ): Promise<FreelancerProfileStatistics | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.freelancerPSConverter)
        .where("freelancerId", "==", freelancerId)
        .get();
      if (!docSnapshot.empty) {
        const freelancer_profile_statistics = docSnapshot.docs.map((e) =>
          e.data()
        );
        return freelancer_profile_statistics[0] as FreelancerProfileStatistics;
      } else {
        console.log("No such freelancer profile statistics found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching freelancer profile statistics :", error);
      return null;
    }
    return null;
  }

  static async updateStatistics(
    profileStatistic: DocumentReference,
    updatedData: Partial<FreelancerProfileStatistics>
  ): Promise<void> {
    // updateResponseTime(newResponseTime: number): void {
    //   this.responseTime = newResponseTime;
    // }
    // updateOrderCompletion(newOrderCompletionRate: number): void {
    //   this.orderCompletionRate = newOrderCompletionRate;
    // }
    // updateOnTimeDelivery(newOnTimeDeliveryRate: number): void {
    //   this.onTimeDeliveryRate = newOnTimeDeliveryRate;
    // }
    // updatePositiveRating(newPositiveRatingPercentage: number): void {
    //   this.positiveRatingPercentage = newPositiveRatingPercentage;
    // }

    profileStatistic.update(withoutNulls(updatedData));
  }
}

export default FreelancerProfileStatisticsService;
