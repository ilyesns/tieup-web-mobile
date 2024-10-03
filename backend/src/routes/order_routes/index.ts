import express from "express";
import clientOrderRouter from "./client_order_route";
import freelancerOrderRouter from "./freelancer_order_route";
import deliverRouter from "./delivery_routes/delivery_route";

const router = express.Router();

router.use("/client", clientOrderRouter);
router.use("/freelancer", freelancerOrderRouter);
router.use("/delivery", deliverRouter);
export default router;
