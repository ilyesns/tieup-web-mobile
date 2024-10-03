import express, { Request, Response } from "express";
import multer from "multer";
import { DynamicObject } from "../../../models/utilities/util";
import FreelancerOfferController from "../../../controllers/freelancer_controllers/offer_controllers/freelancer_offer_controllers";
import OfferGalleryController from "../../../controllers/freelancer_controllers/offer_controllers/freelancer_offer_gallery_contollers";
import { validateToken } from "../../../middlewares/validate_token";

// Create a new router
const router = express.Router();

router.post("/add/:userId", FreelancerOfferController.createOffer);
router.get("/read/:offerId", FreelancerOfferController.getOffer);
router.get(
  "/read-all/:userId",
  FreelancerOfferController.getOffersByFreelancerId
);

router.post("/update/:offerId", FreelancerOfferController.updateOffer);

router.post("/update-offer-status", async (req: Request, res: Response) => {
  try {
    // Assuming the data to update the user is coming in the request body

    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing Doc data");
    // await FreelancerOfferController.updateOffer(data);
    res
      .status(200)
      .send({ message: "freelancer offer status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "failed freelancer offer to update ",
      error: error!.toString(),
    });
  }
});
router.delete(
  "/delete-offer/:offerId",
  validateToken,
  FreelancerOfferController.deleteOffer
);

export default router;
