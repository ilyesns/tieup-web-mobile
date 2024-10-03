import express, { Request, Response } from "express";
import { DynamicObject } from "../../models/utilities/util";
import { DocumentReference } from "firebase-admin/firestore";
import FreelancerOrderController from "../../controllers/order_controllers/freelancer_order_controllers";
import { validateToken } from "../../middlewares/validate_token";

// Create a new router
const router = express.Router();

router.post(
  "/update-status/:orderId",
  validateToken,

  FreelancerOrderController.updateOrderStatus
);

router.post("/cancel", async (req: Request, res: Response) => {
  try {
    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing data");

    await FreelancerOrderController.cancelOrder(data);
    res.status(200).json({ message: "cancel order by client with sucess" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "failed to cancel order by client",
      error: error!.toString(),
    });
  }
});

router.get("/read-one", async (req: Request, res: Response) => {
  try {
    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing data");
    const order = await FreelancerOrderController.getOrderByFreelancerId(data);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "failed to read order  ", error: error!.toString() });
  }
});

router.get(
  "/read-all/:userId",
  //  validateToken,
  FreelancerOrderController.getAllOrdersByFreelancerId
);
router.post(
  "/calcul-total-return-details",
  validateToken,
  FreelancerOrderController.calculOrderTotalAndSendDetails
);
export default router;
