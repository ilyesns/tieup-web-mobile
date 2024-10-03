import { Request, Response } from "express";
import OrderService from "../../services/order_service";
import { classToApi } from "../../models/utilities/util";
import UserService from "../../services/user_service";
import OfferService from "../../services/offer_service";
import { WithdrawalService } from "../../services/withdraw_service";

export default class AdminWithdrawalControllers {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;
      const pageNum = page ? parseInt(page as string) : 0;
      const size = pageSize ? parseInt(pageSize as string) : 10;

      const { withdrawals, totalCount } = await WithdrawalService.readAll(
        size,
        pageNum
      );

      // Calculate total number of pages
      const totalPages = Math.ceil(totalCount / size);
      const withdrawalsWithApi = await Promise.all(
        withdrawals.map(async (w) => await classToApi(w))
      );

      res.status(200).json({ withdrawalsWithApi, totalPages, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get withdrawals",
        error: error!.toString(),
      });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { status } = req.body;

      await WithdrawalService.update(id, status);
      res
        .status(200)
        .send({ message: "update withdrawal status with successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to update withdrawal status",
        error: error!.toString(),
      });
    }
  }
}
