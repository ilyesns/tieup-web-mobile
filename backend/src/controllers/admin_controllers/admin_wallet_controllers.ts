import { Request, Response } from "express";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import WalletFreelancerService from "../../services/wallet_freelancer_service";
import UserService from "../../services/user_service";
import WalletAdminService from "../../services/wallet_admin_service";

export class AdminWalletControllers {
  static async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      if (!userId) {
        throw new Error("Missing document ID.");
      }
      const userRef = UserService.collection.doc(userId);
      console.log(userId);

      const wallet = await WalletAdminService.getWalletByUserId(userRef);
      res.status(200).json(wallet);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to get wallet Admin",
        error: error!.toString(),
      });
    }
  }
}
