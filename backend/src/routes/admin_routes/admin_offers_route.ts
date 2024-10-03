import express, { Request, Response } from "express";
import AdminOfferControllers from "../../controllers/admin_controllers/admin_offers_controllers";

// Create a new router
const router = express.Router();
router.get("/read-all-offers", AdminOfferControllers.getAllOffers);
router.get("/search-offers", AdminOfferControllers.searchOffers);
router.post(
  "/update-offer-status/:offerId",
  AdminOfferControllers.updateStatus
);

export default router;
