import { Request, Response } from "express";
import OrderService from "../../services/order_service";
import { classToApi } from "../../models/utilities/util";
import UserService from "../../services/user_service";
import OfferService from "../../services/offer_service";

export default class AdminOffersControllers {
  static async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;
      const pageNum = page ? parseInt(page as string) : 0;
      const size = pageSize ? parseInt(pageSize as string) : 10;

      const { offers, totalCount } = await OfferService.getAllOffersAdmin(
        pageNum,
        size
      );

      // Calculate total number of pages
      const totalPages = Math.ceil(totalCount / size);
      const offersWithApi = await Promise.all(
        offers.map(async (order) => {
          const freelancer = await UserService.getUser(order.freelancerId!.id);
          let orderApi = await classToApi(order!);
          orderApi.freelancerUsername = freelancer?.username;
          return orderApi;
        })
      );

      res.status(200).json({ offersWithApi, totalPages, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get offers",
        error: error!.toString(),
      });
    }
  }

  static async searchOffers(req: Request, res: Response): Promise<void> {
    try {
      const { term } = req.query;

      const offers = await OfferService.search(term as string);
      // Calculate total number of pages

      const offersWithApi = await Promise.all(
        offers.map(async (u) => await classToApi(u))
      );
      res.status(200).json(offersWithApi);
    } catch (error) {
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const offerId = req.params.offerId;
      const { status } = req.body;
      await OfferService.updateStatus(offerId, status);
      res
        .status(200)
        .send({ message: "update offer status with successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to update offer status",
        error: error!.toString(),
      });
    }
  }
}
