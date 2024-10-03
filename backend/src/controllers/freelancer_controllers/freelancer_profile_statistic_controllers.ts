import { DocumentReference } from "firebase-admin/firestore";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import UserService from "../../services/user_service";
import PortfolioService from "../../services/portfolio_service";

import { uploadImages, uploadVideo } from "../../utilities/functions";
import { Request, Response } from "express";
import FreelancerProfileStatisticsService from "../../services/freelancer_profile_statistics_service";

export default class FreelancerStatisticController {
  static async getProfileStatistic(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    const freelancerRef = UserService.collection.doc(userId);
    try {
      const statistic = await FreelancerProfileStatisticsService.getStatistics(
        freelancerRef
      );

      const statisticToApi = await classToApi(statistic!);
      res.status(200).json(statisticToApi);
    } catch (error) {
      res.status(500).send({
        message: "Error fetching freelancer profile statistic" + error,
      });
      console.error("Error fetching freelancer profile statistic:", error);
    }
  }
}
