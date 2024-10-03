import { OfferStatistic } from "../../../models/offer_statistic";
import OfferService from "../../../services/offer_service";
import OfferStatisticService from "../../../services/offer_statistic_service";
import UserService from "../../../services/user_service";
import FreelancerOfferController from "../offer_controllers/freelancer_offer_controllers";

export default class OfferStatisticController {
  static async getOfferStatisticBy(
    freelancerId: string
  ): Promise<OfferStatistic | null> {
    const freelancerRef = UserService.collection.doc(freelancerId);
    const offer = await OfferService.getOfferBy(freelancerRef);
    const offerStat = await OfferStatisticService.getOfferStatistic(
      offer?.documentRef!.id!
    );
    return offerStat;
  }
  static async getAllOfferStatisticBy(
    freelancerId: string
  ): Promise<OfferStatistic[] | null> {
    const freelancerRef = UserService.collection.doc(freelancerId);

    const offer = await OfferService.getOfferBy(freelancerRef);
    const offerStat = await OfferStatisticService.getAllOfferStatistic(
      offer?.documentRef!.id!
    );
    return offerStat;
  }
  static async totalMade(offerId?: string): Promise<void> {
    const offerRef = (await OfferService.getOffer(offerId!))?.documentRef;
    const offerStat = await OfferStatisticService.getOfferStatisticByOfferId(
      offerRef!
    );
    await OfferStatisticService.incrementTotalMade(offerStat!);
  }
  static async clicks(offerId: string): Promise<void> {
    const offerRef = (await OfferService.getOffer(offerId!))?.documentRef;
    const offerStat = await OfferStatisticService.getOfferStatisticByOfferId(
      offerRef!
    );
    await OfferStatisticService.incrementClicks(offerStat!);
  }
  static async Impressions(offerId?: string): Promise<void> {
    const offerRef = (await OfferService.getOffer(offerId!))?.documentRef;
    const offerStat = await OfferStatisticService.getOfferStatisticByOfferId(
      offerRef!
    );
    await OfferStatisticService.incrementImpressions(offerStat!);
  }
  static async totalRating(offerId?: string): Promise<void> {
    const offerRef = (await OfferService.getOffer(offerId!))?.documentRef;
    const offerStat = await OfferStatisticService.getOfferStatisticByOfferId(
      offerRef!
    );
    await OfferStatisticService.incrementTotalRating(offerStat!);
  }
}
