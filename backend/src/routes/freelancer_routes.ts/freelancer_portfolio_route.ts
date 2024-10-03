import express, { Request, Response } from "express";
import { DynamicObject } from "../../models/utilities/util";
import multer from "multer";
import FreelancerPortfolioController from "../../controllers/freelancer_controllers/freelancer_portfolio_controllers";
const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post(
  "/add-portfolio-item/:freelancerId",
  upload.fields([
    { name: "images", maxCount: 10 }, // Allow up to 3 image files
    { name: "videos", maxCount: 3 }, // Allow up to  3 video files
  ]),

  FreelancerPortfolioController.addPorfolioItem
);
router.get(
  "/read-portfolio/:freelancerId",
  FreelancerPortfolioController.getFreelancerPortfolio
);

router.post(
  "/delete-portfolio-item/:freelancerId",
  FreelancerPortfolioController.deletePortfolioItem
);

export default router;
