import { Request, Response } from "express";
import UserService from "../../services/user_service";
import { WithdrawalOnDemand } from "../../models/withdrawal_on_demand";
import { WithdrawalService } from "../../services/withdraw_service";
import { withoutNulls } from "../../models/utilities/util";

export class FreelancerWithdrawalController {
  static async AskWithdraw(req: Request, res: Response): Promise<void> {
    try {
      const { userId, name, amount, accountNumber, contactInfo } = req.body;

      const userRef = UserService.collection.doc(userId);

      const withdrawal = WithdrawalOnDemand.fromDefaults({
        amount: amount,
        contactInfo: contactInfo,
        name: name,
        accountNumber: accountNumber,
        userId: userRef,
      });

      await WithdrawalService.create(withdrawal);

      res.status(200).send({ message: "Withdraw demand sent successfully" });
    } catch (error) {
      console.error("Failed to sent withdraw demand:", error);
      res.status(500).send("Failed to sent withdraw demand");
    }
  }
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { page, pageSize } = req.query;
      const pageNum = page ? parseInt(page as string) : 0;
      const size = pageSize ? parseInt(pageSize as string) : 10;

      const userRef = UserService.collection.doc(userId);

      const { withdrawals, totalCount } =
        await WithdrawalService.readAllByUserId(userRef, size, pageNum);
      const totalPages = Math.ceil(totalCount / size);

      res.status(200).json({ withdrawals, totalPages, totalCount });
    } catch (error) {
      console.error("Failed to sent withdraw demand:", error);
      res.status(500).send("Failed to sent withdraw demand");
    }
  }
}
