import express, { Request, Response } from "express";
import { OfferControllers } from "../../controllers/offer_controllers/offer_controllers";
// Create a new router
const router = express.Router();

router.get("/read-all", OfferControllers.getOffers);

export default router;
