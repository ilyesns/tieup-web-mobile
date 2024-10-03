import { Offer } from "../../../models/offer";
import { DynamicObject, classToApi } from "../../../models/utilities/util";
import OfferService from "../../../services/offer_service";
import OfferStatisticService from "../../../services/offer_statistic_service";
import ServiceService from "../../../services/service_service";
import UserService from "../../../services/user_service";
import OfferGalleryController from "./freelancer_offer_gallery_contollers";
import OfferPlanController from "./freelancer_offer_plan_controllers";

import express, { Request, Response } from "express";

export default class FreelancerOfferController {
  static async createOffer(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId: string = req.params.userId;
      if (!userId) throw "Missing Doc Id";
      let offerData: DynamicObject = req.body;
      console.log(offerData);
      const freelancerId = UserService.collection.doc(userId);
      const offerRef = await OfferService.createOffer(freelancerId, offerData);

      await OfferStatisticService.createOfferStatistic({
        freelancerId: freelancerId!,
        offerId: offerRef!,
      });
      res.status(200).send(offerRef!.id);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to create freelancer offer",
        error: error!.toString(),
      });
    }
  }

  static async updateOffer(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body

      const offerData: DynamicObject = req.body;
      const offerId = req.params.offerId;
      if (!offerData) throw new Error("Missing Doc data");

      const offer = {
        title: offerData.title,
        description: offerData.description,
        status: offerData.status,
      };
      await OfferService.updateOffer(offerId, offer);

      res.status(200).send({ message: "freelancer offer update successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed freelancer offer to update ",
        error: error!.toString(),
      });
    }
  }

  static async deleteOffer(req: Request, res: Response): Promise<void> {
    try {
      const offerId: string = req.params.offerId;

      await OfferStatisticService.deleteOfferStatistic(offerId);
      await OfferGalleryController.deleteGallery(offerId);

      await OfferService.deleteOffer(offerId);

      res
        .status(200)
        .send({ message: "freelancer offer delete item successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed freelancer offer to delete item",
        error: error!.toString(),
      });
    }
  }
  static async getOfferByFreelancerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId = req.params.userId;
      if (!userId) throw "Missing Doc Id";
      const freelancerRef = UserService.collection.doc(userId);
      const offer = await OfferService.getOfferBy(freelancerRef);
      res.status(200).json(offer);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get freelancer offer",
        error: error!.toString(),
      });
    }
  }
  static async getOffer(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const offerId = req.params.offerId;
      if (!offerId) throw "Missing Doc offerId";
      const offer = await OfferService.getOffer(offerId);
      const offerToApi = await classToApi(offer!);
      res.status(200).json(offerToApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get offer",
        error: error!.toString(),
      });
    }
  }
  static async getOffersByFreelancerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId = req.params.userId;
      if (!userId) throw "Missing Doc Id";
      const freelancerRef = UserService.collection.doc(userId);
      const offers = await OfferService.getAllOffersBy(freelancerRef);
      // Fetch offer statistics for each offer
      const offerStatisticsPromises = offers.map(async (offer) => {
        const offerStatistic =
          await OfferStatisticService.getOfferStatisticByOfferId(
            offer!.documentRef!
          );
        return {
          offer: offer,
          offerStatistic: offerStatistic!,
        };
      });

      // Wait for all offer statistic promises to resolve
      const offersWithStatistics = await Promise.all(offerStatisticsPromises);

      const offersToApi = await Promise.all(
        offersWithStatistics.map(async (data) => {
          return {
            offer: await classToApi(data.offer),
            statistic: await classToApi(data.offerStatistic),
          };
        })
      );
      res.status(200).json(offersToApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get freelancer offers",
        error: error!.toString(),
      });
    }
  }
}
