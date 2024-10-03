import express, { Request, Response } from "express";
import ServicesControllers from "../../controllers/services_controllers/services_controllers";

const router = express.Router();

router.get("/read-services", async (req: Request, res: Response) => {
  try {
    const service = await ServicesControllers.getAllServices();
    res.status(200).json(service);
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to get Services", error: error!.toString() });
  }
});
router.get(
  "/read-sub-services:serviceId",
  async (req: Request, res: Response) => {
    try {
      const serviceId = req.params.serviceId;
      if (!serviceId) throw "Missing Doc serviceId ";
      const service = await ServicesControllers.getAllSubServicesBy(serviceId);
      res.status(200).send(service);
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to get Sub Services",
        error: error!.toString(),
      });
    }
  }
);

export default router;
