import express, { Request, Response } from "express";
import { DynamicObject } from "../models/utilities/util";
import UserController from "../controllers/user_controllers";
import multer from "multer";
import { validateToken } from "../middlewares/validate_token";
import UserService from "../services/user_service";
const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    // Assuming the data to update the user is coming in the request body
    const data: DynamicObject = req.body;
    if (!data) throw "Missing Doc Id";

    await UserController.createUser(data);
    res.status(200).json({ message: "User create successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create the user", error: error!.toString() });
  }
});

router.post("/may-be-create", UserController.mayBeCreateUser);
router.post("/update/:userId", UserController.updateUser);
router.get("/read/:userId", validateToken, UserController.getUser);
//
router.get("/freelancer-profile/:userId", UserController.getFreelancer);

router.post("/delete", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data) throw "Missing Doc Id";
    await UserController.deleteAccount(data);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to delete the user", error: error!.toString() });
  }
});
router.post(
  "/upload-photo/:userId",
  upload.single("file"),
  UserController.uploadPhoto
);
router.post(
  "/send-email-verification/:userId",
  UserController.sendVerificationEmail
);

router.post("/change-password", async (req: Request, res: Response) => {
  try {
    // Assuming the data to update the user is coming in the request body
    const data: DynamicObject = req.body;
    console.log(data);
    if (!data) throw "Missing Doc Id";

    await UserController.changePassword(data);

    res.status(200).send({ message: "User change password successfully" });
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res.status(500).send({
      message: "Failed to change password the user",
      error: error!.toString(),
    });
  }
});
router.post("/switch-role/:userId", UserController.switchRole);

router.post("/become-freelancer/:userId", UserController.becomeFreelancer);
router.post(
  "/update-freelancer-field/:userId",
  UserController.updateFreelancerField
);

export default router;
