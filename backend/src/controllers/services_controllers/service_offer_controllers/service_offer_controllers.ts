import { Offer } from "../../../models/offer";
import { DynamicObject, classToApi } from "../../../models/utilities/util";
import FreelancerProfileStatisticsService from "../../../services/freelancer_profile_statistics_service";
import FreelancerService from "../../../services/freelancer_service";
import OfferService from "../../../services/offer_service";
import ServiceService from "../../../services/service_service";
import { Request, Response } from "express";
import UserService from "../../../services/user_service";

export default class ServiceOfferController {
  static async getSearchedOffers(req: Request, res: Response): Promise<void> {
    const term = req.query.term as string; // Cast term to string
    try {
      const offers = await OfferService.search(term);

      const offerUsersPromises = offers!.map(async (offer) => {
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
          levelUser: levelUser!,
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
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getOffersByServiceId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const serviceId = req.params.serviceId;
      const currentUserId = req.query.userId as string;
      if (!serviceId) throw new Error("Service id not found");
      const serviceRef = await ServiceService.collection.doc(serviceId);
      let currentUserRef;
      if (currentUserId) {
        currentUserRef = UserService.collection.doc(currentUserId);
      }
      const offers = await OfferService.getAllOffersByServiceId(
        serviceRef,
        currentUserRef!
      );
      const offerUsersPromises = offers!.map(async (offer) => {
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
          levelUser: levelUser!,
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
        message: "Failed to get offers by services",
        error: error!.toString(),
      });
    }
  }
}
