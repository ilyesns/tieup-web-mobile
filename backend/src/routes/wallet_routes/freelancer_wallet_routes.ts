import express, { Request, Response } from "express";
import { FreelancerWalletControllers } from "../../controllers/wallet_controllers/freelancer_wallet_controllers";

const router = express.Router();

router.get("/read/:userId", FreelancerWalletControllers.getWallet);

export default router;
