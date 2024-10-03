import express, { Request, Response } from "express";
import AdminWithdrawalControllers from "../../controllers/admin_controllers/admin_withdrawal_controllers";

// Create a new router
const router = express.Router();
router.get("/read-all-withdrawals", AdminWithdrawalControllers.getAll);
router.post(
  "/update-withdrawal-status/:id",
  AdminWithdrawalControllers.updateStatus
);

export default router;
