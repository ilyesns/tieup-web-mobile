import { Request, Response } from "express";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import WalletFreelancerService from "../../services/wallet_freelancer_service";
import UserService from "../../services/user_service";

export class FreelancerWalletControllers {
  static async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      if (!userId) {
        throw new Error("Missing document ID.");
      }
      const userRef = UserService.collection.doc(userId);
      const wallet = await WalletFreelancerService.getWalletByUserId(userRef);
      const walletToApi = await classToApi(wallet!);

      res.status(200).json(walletToApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to get wallet Freelancer",
        error: error!.toString(),
      });
    }
  }
}
