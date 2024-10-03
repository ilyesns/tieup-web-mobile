import { Request, Response } from "express";
import OrderService from "../../services/order_service";
import { classToApi } from "../../models/utilities/util";
import UserService from "../../services/user_service";

export default class AdminOrdersControllers {
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;
      const pageNum = page ? parseInt(page as string) : 0;
      const size = pageSize ? parseInt(pageSize as string) : 10;

      const { orders, totalCount } = await OrderService.getAllOrders(
        pageNum,
        size
      );

      // Calculate total number of pages
      const totalPages = Math.ceil(totalCount / size);
      const ordersWithApi = await Promise.all(
        orders.map(async (order) => {
          const client = await UserService.getUser(order.clientId.id);
          const freelancer = await UserService.getUser(order.freelancerId.id);

          let orderApi = await classToApi(order!);
          orderApi.clientUsername = client?.username;
          orderApi.freelancerUsername = freelancer?.username;
          return orderApi;
        })
      );

      res.status(200).json({ ordersWithApi, totalPages, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed to get orders",
        error: error!.toString(),
      });
    }
  }
  static async searchOrders(req: Request, res: Response): Promise<void> {
    try {
      const { term } = req.query;

      const orders = await OrderService.search(term as string);
      // Calculate total number of pages
      const usersToApi = await Promise.all(
        orders.map(async (u) => await classToApi(u))
      );
      res.status(200).json(usersToApi);
    } catch (error) {
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
