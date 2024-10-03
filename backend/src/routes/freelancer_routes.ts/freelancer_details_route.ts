import express, { Request, Response } from "express";
import FreelancerDetailsControllers from "../../controllers/freelancer_controllers/freelancer_details_controllers/freelancer_details.controllers";

// Create a new router
const router = express.Router();

router.get("/read-details/:userId", FreelancerDetailsControllers.getDetails);

export default router;
