import { Request, Response } from "express";
import OfferService from "../../services/offer_service";
import FreelancerService from "../../services/freelancer_service";
import { classToApi } from "../../models/utilities/util";
import FreelancerProfileStatisticsService from "../../services/freelancer_profile_statistics_service";

export class OfferControllers {
  static async getOffers(req: Request, res: Response): Promise<void> {
    try {
      const { offers } = await OfferService.getAllOffers(0, 15);
      // Fetch offer statistics for each offer
      const offerUsersPromises = offers.map(async (offer) => {
        const offerUser = await FreelancerService.getFreelancer(
          offer!.freelancerId!.id
        );
        const levelUser =
          await FreelancerProfileStatisticsService.getStatistics(
            offer!.freelancerId!
          );
        return {
          offer: offer,
          user: offerUser!,
          levelUser: levelUser,
        };
      });

      // Wait for all offer statistic promises to resolve
      const offersWithUser = await Promise.all(offerUsersPromises);

      const offersToApi = await Promise.all(
        offersWithUser.map(async (data) => {
          return {
            offer: await classToApi(data.offer),
            user: await classToApi(data.user),
            levelUser: await classToApi(data.levelUser!),
          };
        })
      );
      res.status(200).json(offersToApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get  offers",
        error: error!.toString(),
      });
    }
  }
}
