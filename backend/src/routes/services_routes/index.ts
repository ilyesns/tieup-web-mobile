import express from "express";
import serviceRouter from "./services_route";
import adminServiceRouter from "../admin_routes/admin_service_route";
import serviceOfferRouter from "./service_offer_routes/service_offer_route";

const router = express.Router();

router.use(serviceRouter);
router.use("/admin", adminServiceRouter);
router.use("/offer", serviceOfferRouter);

export default router;
