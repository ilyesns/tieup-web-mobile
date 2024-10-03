import express, { Request, Response } from "express";
import FreelancerService from "../../../services/freelancer_service";

export default class FreelancerDetailsControllers {
  static async getDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const details = await FreelancerService.getFreelancerDetails(userId);

      res.status(200).json(details);
    } catch (e) {
      console.log(e);
      res.status(500).json("Error to get freelancerDetails " + e);
    }
  }
}
