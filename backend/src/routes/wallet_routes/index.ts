import express from "express";
import freelancerWallet from "./freelancer_wallet_routes";

const router = express.Router();

export default router.use("/freelancer", freelancerWallet);
