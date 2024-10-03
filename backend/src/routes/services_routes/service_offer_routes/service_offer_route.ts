import express, { Request, Response } from "express";
import ServiceOfferController from "../../../controllers/services_controllers/service_offer_controllers/service_offer_controllers";
// Create a new router
const router = express.Router();

router.get(
  "/read-offers/:serviceId",
  ServiceOfferController.getOffersByServiceId
);
router.get("/read-searched-offers", ServiceOfferController.getSearchedOffers);

export default router;
