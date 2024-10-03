import express, { Request, Response } from "express";
import { FreelancerWalletControllers } from "../../controllers/wallet_controllers/freelancer_wallet_controllers";
import { AdminWalletControllers } from "../../controllers/admin_controllers/admin_wallet_controllers";

const router = express.Router();

router.get("/wallet-read/:userId", AdminWalletControllers.getWallet);

export default router;
