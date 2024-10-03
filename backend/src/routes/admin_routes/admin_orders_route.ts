import express, { Request, Response } from "express";
import AdminOrdersControllers from "../../controllers/admin_controllers/admin_orders_controllers";

// Create a new router
const router = express.Router();
router.get("/read-all-orders", AdminOrdersControllers.getAllOrders);
router.get("/search-orders", AdminOrdersControllers.searchOrders);

export default router;
