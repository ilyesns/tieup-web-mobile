import express, { Request, Response } from "express";
import { validateToken } from "../../../middlewares/validate_token";
import multer from "multer";

import DeliveryControllers from "../../../controllers/order_controllers/delivery_contollers/delivery_controlles";

const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post(
  "/add/:orderId",
  upload.single("file"),
  validateToken,
  DeliveryControllers.createDelivery
);
router.get(
  "/read-all/:orderId",
  validateToken,
  DeliveryControllers.getDeliveries
);
export default router;
