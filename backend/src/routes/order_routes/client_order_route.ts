import express, { Request, Response } from "express";
import { DynamicObject } from "../../models/utilities/util";
import ClientOrderController from "../../controllers/order_controllers/client_order_controllers";
import { validateToken } from "../../middlewares/validate_token";

// Create a new router
const router = express.Router();

router.post("/place", validateToken, ClientOrderController.PlaceOrder);

router.post("/cancel", async (req: Request, res: Response) => {
  try {
    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing data");

    await ClientOrderController.cancelOrder(data);
    res.status(200).json({ message: "cancel order by client with sucess" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "failesd to cancel order by client",
      error: error!.toString(),
    });
  }
});

router.post("/update-status/:orderId", ClientOrderController.updateOrderStatus);

router.get("/read-one", async (req: Request, res: Response) => {
  try {
    const data: DynamicObject = req.body;
    if (!data) throw new Error("Missing data");
    const order = await ClientOrderController.getOrderByClientId(data);
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
  validateToken,
  ClientOrderController.getAllOrdersByClientId
);

router.post(
  "/calcul-total-return-details",
  validateToken,
  ClientOrderController.calculOrderTotalAndSendDetails
);

export default router;
