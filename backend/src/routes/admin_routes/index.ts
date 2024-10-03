import express from "express";
import adminUsers from "./admin_users_route";
import adminServices from "./admin_service_route";
import adminOrders from "./admin_orders_route";
import adminOffers from "./admin_offers_route";
import adminWithdrawals from "./admin_withdrawal_route";
import adminWallet from "./admin_wallet_routes";

const router = express.Router();

export default router.use(
  adminUsers,
  adminServices,
  adminOrders,
  adminOffers,
  adminWithdrawals,
  adminWallet
);
