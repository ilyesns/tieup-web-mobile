import express, { Request, Response } from "express";
import FreelancerStatisticController from "../../controllers/freelancer_controllers/freelancer_profile_statistic_controllers";
import { FreelancerWithdrawalController } from "../../controllers/freelancer_controllers/freelancer_withdrawl_controllers";

// Create a new router
const router = express.Router();

router.post("/ask-withdrawal", FreelancerWithdrawalController.AskWithdraw);
router.get("/read-withdrawals/:userId", FreelancerWithdrawalController.getAll);

export default router;
