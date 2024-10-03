import express, { Request, Response } from "express";
import FreelancerStatisticController from "../../controllers/freelancer_controllers/freelancer_profile_statistic_controllers";

// Create a new router
const router = express.Router();

router.get(
  "/read-statistic/:userId",
  FreelancerStatisticController.getProfileStatistic
);

export default router;
