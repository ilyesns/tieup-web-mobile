import { Request, Response } from "express";
import UserService from "../../services/user_service";
import { classToApi } from "../../models/utilities/util";
import { Role } from "../../utilities/enums";

export default class AdminUsersController {
  static async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize, role } = req.query;
      const pageNum = page ? parseInt(page as string) : 0;
      const size = pageSize ? parseInt(pageSize as string) : 10;
      const userRole =
        typeof role === "string" && role.includes("client")
          ? Role.Client
          : Role.Freelancer;
      const { users, totalCount } = await UserService.getAllUsers(
        userRole,
        pageNum,
        size
      );
      // Calculate total number of pages
      const totalPages = Math.ceil(totalCount / size);

      const usersToApi = await Promise.all(
        users.map(async (u) => await classToApi(u))
      );
      res.json({ usersToApi, totalPages, totalCount });
    } catch (error) {
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getAllUsersNumber(req: Request, res: Response): Promise<void> {
    try {
      const num = await UserService.getAllUsersNumber();
      // Calculate total number of pages

      res.json({ num });
    } catch (error) {
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { term } = req.query;

      const users = await UserService.search(term as string);
      // Calculate total number of pages

      const usersToApi = await Promise.all(
        users.map(async (u) => await classToApi(u))
      );
      res.status(200).json(usersToApi);
    } catch (error) {
      console.error("Error occurred while searching for offers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
