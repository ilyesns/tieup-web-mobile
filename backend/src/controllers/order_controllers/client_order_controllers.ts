import WalletAdmin from "../../models/admin_wallet";
import FreelancerProfileStatistics from "../../models/freelancer_profile_statistics";
import Order from "../../models/order";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import WalletFreelancer from "../../models/wallet _freelancer";
import { paymentProcessHandler } from "../../payment/payment_process";
import ClientService from "../../services/client_service";
import FreelancerProfileStatisticsService from "../../services/freelancer_profile_statistics_service";
import OfferService from "../../services/offer_service";
import OrderService from "../../services/order_service";
import UserService from "../../services/user_service";
import WalletAdminService from "../../services/wallet_admin_service";
import WalletFreelancerService from "../../services/wallet_freelancer_service";
import { PricingService } from "../../utilities/constant";
import { OrderPaymentStatus, OrderStatus } from "../../utilities/enums";
import { generateString } from "../../utilities/functions";
import { Request, Response } from "express";

export default class ClientOrderController {
  static async PlaceOrder(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const data: DynamicObject = req.body;
      if (!data) throw "Missing data";
      const {
        offerId,
        freelancerId,
        clientId,
        base,
        total,
        serviceFee,
        expiration,
        description,
        plan,
      } = data;

      const offerRef = OfferService.collection.doc(offerId);
      const freelancerRef = UserService.collection.doc(freelancerId);
      const client = await ClientService.getClient(clientId);
      const orderId = generateString();

      const daysMatch = expiration.match(/\d+/);

      const daysDelivery = parseInt(daysMatch[0]);
      // Calculate the delivery date
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + daysDelivery);
      const orderRef = await OrderService.createOrder({
        orderId: orderId,
        clientId: client?.documentId!,
        createdDate: new Date(),
        freelancerId: freelancerRef!,
        offerId: offerRef!,
        plan: plan,
        adminFee: serviceFee,
        paymentStatus: OrderPaymentStatus.UNPAID,
        basePrice: parseFloat(base),
        totalPrice: total,
        status: OrderStatus.Pending,
        expiration: deliveryDate,
      });

      const url = await paymentProcessHandler({
        amount: Math.floor(total * 1000),
        description: "buy offer " + offerId,
        email: client?.email!,
        firstName: client?.firstName!,
        lastName: client?.lastName!,
        orderId: orderId,
        phoneNumber: client?.phoneNumber!,
      });
      console.log(url);
      res.status(200).json(url);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "failed to place order", error: error!.toString() });
    }
  }

  static async cancelOrder(data: DynamicObject): Promise<void> {
    const { orderId, reason }: { orderId?: string; reason?: string } = data;
    if (!orderId) throw new Error("Missing parameter 'orderId'");

    let order = await OrderService.getOrder(orderId);
    await OrderService.setHistoryOrder(order!, reason!);
    OrderService.updateOrderStatus(order!, OrderStatus.Cancelled);
  }
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId: string = req.params.orderId;
    const { status, fee } = req.body;
    try {
      let newStatus;
      switch (status) {
        case "completed":
          newStatus = OrderStatus.Completed;
          break;
      }

      let order = await OrderService.getOrder(orderId);
      await OrderService.setHistoryOrder(
        order!,
        `Order ${order?.orderId} has been updated to ${status}`
      );

      let freelancerWallet = await WalletFreelancerService.getWalletByUserId(
        order?.freelancerId!
      );
      let freelancerStatisProfile =
        await FreelancerProfileStatisticsService.getStatistics(
          order?.freelancerId!
        );

      let projects = freelancerStatisProfile?.orderCompletionRate ?? 0;

      let totalProjects = projects + 1;
      let newProfile = new FreelancerProfileStatistics({
        ...freelancerStatisProfile!,
        orderCompletionRate: totalProjects,
      });
      await FreelancerProfileStatisticsService.updateStatistics(
        freelancerStatisProfile?.documentRef!,
        newProfile
      );
      const serviceFee =
        (order?.basePrice! * PricingService.feePercentageFreelancer) / 100;

      const total = order?.basePrice! - serviceFee;

      let newBalance = freelancerWallet?.balance! + total;
      let updatedWallet = new WalletFreelancer({
        ...freelancerWallet!,
        balance: newBalance,
      });
      let walletAdmin = await WalletAdminService.getWalletAdmin(
        "1VF3gJQC4XNy86rli3nB"
      );
      console.log(walletAdmin?.totalPendingClearance);
      let newBalanceAdmin = walletAdmin?.balance! + order?.adminFee!;
      let totalPC = walletAdmin?.totalPendingClearance! ?? 0;
      totalPC += order?.basePrice!;

      let newAdminProfile = new WalletAdmin({
        ...walletAdmin!,
        balance: newBalanceAdmin,
        totalPendingClearance: totalPC,
      });

      await WalletAdminService.updateWalletAdmin(
        "1VF3gJQC4XNy86rli3nB",
        newAdminProfile
      );
      await WalletFreelancerService.updateWalletFreelancer(
        freelancerWallet?.walletId!,
        updatedWallet
      );

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

  static async getOrderByClientId(data: DynamicObject): Promise<Order | null> {
    const { userId } = data;
    if (!userId) throw new Error("Missing parameter 'orderId'");

    const clientRef = UserService.collection.doc(userId);

    return await OrderService.getOrderByUserID(clientRef, "clientId");
  }
  static async getAllOrdersByClientId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId: string = req.params.userId;

      if (!userId) throw new Error("Missing userId");

      const clientRef = UserService.collection.doc(userId);

      const orders = await OrderService.getAllOrdersByUserID(
        clientRef,
        "clientId"
      );
      let ordersWithApi: any | [] = [];
      if (orders && orders!.length !== 0) {
        ordersWithApi = await Promise.all(
          orders!.map(async (order) => {
            const freelancer = await UserService.getUser(
              order.freelancerId.id!
            );
            const offer = await OfferService.getOffer(order.offerId.id);
            const orderApi = await classToApi(order!);
            orderApi.freelancerPhotoUrl = freelancer!.photoURL!;
            orderApi.freelancerUserName = freelancer!.username;
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

  static calculOrderTotalAndSendDetails(req: Request, res: Response) {
    try {
      const { basePrice } = req.body;
      const totalPrice = parseInt(basePrice);

      const serviceFee =
        (totalPrice * PricingService.feePercentageClient) / 100;

      const total = totalPrice + serviceFee;

      // Construct and return the result JSON
      const result = {
        starterFromPrice: parseInt(basePrice),
        serviceFee: serviceFee,
        total: total,
      };
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Failed to calcul Order Total " });
    }
  }
}
