import express, { Request, Response } from "express";
import { DynamicObject } from "../../../models/utilities/util";
import OfferPlanController from "../../../controllers/freelancer_controllers/offer_controllers/freelancer_offer_plan_controllers";

// Create a new router
const router = express.Router();

router.post("/add-plan/:offerId", OfferPlanController.createPlan);

router.post("/update-plan/:offerId", OfferPlanController.updatePlan);
router.post("/delete-plan", async (req: Request, res: Response) => {
  try {
    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing Doc data");

    await OfferPlanController.deletePlan(data);
    res.status(200).send({ message: "offer Plan delete item successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "failed freelancer Plan to delete item",
      error: error!.toString(),
    });
  }
});

export default router;
