import { Request, Response } from "express";
import DeliveryService from "../../../services/delivery_service";
import { uploadToFirebaseStorage } from "../../../utilities/firestorage_methods";
import OrderService from "../../../services/order_service";
import { uploadFile } from "../../../utilities/functions";
import { classToApi } from "../../../models/utilities/util";

export default class DeliveryControllers {
  static async createDelivery(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const { note } = req.body;
      const file = req.file as Express.Multer.File;

      if (!orderId) {
        throw new Error("Order id is required");
      }

      const order = await OrderService.getOrder(orderId);
      const uploadedFile = await uploadFile(
        file!,
        order?.freelancerId.id!,
        "deliveries"
      );

      const deliveryNumber = await DeliveryService.deliveryCounter(orderId);

      const delivery = DeliveryService.createDelivery({
        deliveryDate: new Date(),
        note: note,
        file: uploadedFile!,
        orderId: order?.documentRef!,
        deliveryNumber: deliveryNumber + 1,
      });
      res.status(200).send({ message: "Adding a delivery with successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        message: "Failed to Add delivery  ",
      });
    }
  }

  static async getDeliveries(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;

      const deliveries = await DeliveryService.getAllDeliveryByOrderId(orderId);
      const deliveriesToApi = await Promise.all(
        deliveries.map(async (d) => await classToApi(d))
      );

      res.status(200).json(deliveriesToApi);
    } catch (e) {
      console.log(e);
      res.status(500).send({
        message: "Failed to get deliveries",
      });
    }
  }
}
