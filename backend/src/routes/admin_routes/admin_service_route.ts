import express, { Request, Response } from "express";
import multer from "multer";
import { DynamicObject } from "../../models/utilities/util";
import AdminServiceController from "../../controllers/admin_controllers/admin_service_controllers";
const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post(
  "/add-service",
  upload.single("file"),
  AdminServiceController.createService
);

router.post(
  "/update-service/:serviceId",
  upload.single("file"),
  AdminServiceController.updateService
);
router.get("/search-services", AdminServiceController.search);

router.get("/read-services", async (req: Request, res: Response) => {
  try {
    const service = await AdminServiceController.getAllServices();
    res.status(200).send(service);
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to get Services", error: error!.toString() });
  }
});
router.get("/read-sub-services", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data) throw "Missing Doc Id";
    const service = await AdminServiceController.getAllSubServicesBy(data);
    res.status(200).send(service);
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to get Services", error: error!.toString() });
  }
});
router.delete(
  "/delete-service/:serviceId",
  AdminServiceController.deleteService
);

export default router;
