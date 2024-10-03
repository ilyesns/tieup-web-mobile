import { Request, Response } from "express";
import Order from "../../models/order";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import { paymentProcessHandler } from "../../payment/payment_process";
import ClientService from "../../services/client_service";
import OfferService from "../../services/offer_service";
import OrderService from "../../services/order_service";
import UserService from "../../services/user_service";
import { PricingService } from "../../utilities/constant";
import { OrderPaymentStatus, OrderStatus } from "../../utilities/enums";
import { generateString } from "../../utilities/functions";

export default class FreelancerOrderController {
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderId: string = req.params.orderId;
      const { status, fee } = req.body;
      if (!orderId) throw new Error("Missing parameter 'orderId'");
      let newStatus;
      switch (status) {
        case "pending":
          newStatus = OrderStatus.Pending;
          break;
        case "inProgress":
          newStatus = OrderStatus.InProgress;
          break;
        case "delivered":
          newStatus = OrderStatus.Delivered;
          break;
        case "cancelled":
          newStatus = OrderStatus.Cancelled;
        case "completed":
          newStatus = OrderStatus.Completed;
          break;
      }

      let order = await OrderService.getOrder(orderId);
      await OrderService.setHistoryOrder(
        order!,
        `Order ${order?.orderId} has been updated to ${status}`
      );

      if (newStatus === OrderStatus.InProgress && fee) {
        await OrderService.updateAdminFee(order!, fee);
      }

      await OrderService.updateOrderStatus(order!, newStatus!);

      res.status(200).send({ message: "updated order status  successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to update order status  ",
        error: error!.toString(),
      });
    }
  }

  static async getOrderByFreelancerId(
    data: DynamicObject
  ): Promise<Order | null> {
    const { userId } = data;
    if (!userId) throw new Error("Missing parameter 'orderId'");

    const freelancerRef = UserService.collection.doc(userId);

    return await OrderService.getOrderByUserID(freelancerRef, "freelancerId");
  }
  static async getAllOrdersByFreelancerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId: string = req.params.userId;
      if (!userId) throw new Error("Missing userId");
      const freelancerRef = UserService.collection.doc(userId);

      const orders = await OrderService.getAllOrdersByUserID(
        freelancerRef,
        "freelancerId"
      );
      let ordersWithApi: any | [] = [];
      if (orders && orders!.length !== 0) {
        ordersWithApi = await Promise.all(
          orders!.map(async (order) => {
            const client = await UserService.getUser(order.clientId.id!);
            const offer = await OfferService.getOffer(order.offerId.id);
            const orderApi = await classToApi(order!);
            orderApi.clientPhotoUrl = client!.photoURL!;
            orderApi.clientUserName = client!.username;
            orderApi.offerTitle = offer!.title;
            orderApi.offerImage = offer!.gallery?.images![0].url || "";
            return orderApi;
          })
        );
      }

      res.status(200).json(ordersWithApi);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "failed to read orders  ", error: error!.toString() });
    }
  }

  static async cancelOrder(data: DynamicObject): Promise<void> {
    const { orderId, reason }: { orderId?: string; reason?: string } = data;
    if (!orderId) throw new Error("Missing parameter 'orderId'");

    let order = await OrderService.getOrder(orderId);
    await OrderService.setHistoryOrder(order!, reason!);
    OrderService.updateOrderStatus(order!, OrderStatus.Cancelled);
  }

  static calculOrderTotalAndSendDetails(req: Request, res: Response) {
    try {
      const { basePrice } = req.body;

      const totalPrice = parseInt(basePrice);

      const serviceFee =
        (totalPrice * PricingService.feePercentageFreelancer) / 100;

      const total = totalPrice - serviceFee;

      // Construct and return the result JSON
      const result = {
        starterFromPrice: parseInt(basePrice),
        serviceFee: serviceFee,
        total: total,
      };
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .send({ message: "Failed to calcul Order Total Freelancer " });
    }
  }
}
