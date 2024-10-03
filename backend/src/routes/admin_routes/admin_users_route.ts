import express, { Request, Response } from "express";
import AdminUsersController from "../../controllers/admin_controllers/admin_users_controllers";

// Create a new router
const router = express.Router();
router.get("/read-all-users", AdminUsersController.getAllUser);
router.get("/read-all-users-number", AdminUsersController.getAllUsersNumber);
router.get("/search-users", AdminUsersController.searchUsers);

export default router;
