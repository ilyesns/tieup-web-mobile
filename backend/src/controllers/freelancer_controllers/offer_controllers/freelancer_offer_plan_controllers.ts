import { Request, Response } from "express";
import { DynamicObject } from "../../../models/utilities/util";
import PlanService from "../../../services/plan_service";

export default class OfferPlanController {
  static async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const offerId = req.params.offerId;
      const planData = req.body;
      await PlanService.createPlan(offerId, planData);
      res.status(200).json({ message: "adding plan with succcessfuly" });
    } catch (e) {
      res.status(500).json({ message: "error to add plan " });
    }
  }
  static async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const offerId = req.params.offerId;
      const planData = req.body;
      await PlanService.updatePlan(offerId, planData, planData.planType);
      res.status(200).json({ message: "updating plan with succcessfuly" });
    } catch (e) {
      res.status(500).json({ message: "error to update plan " });
    }
  }
  static async deletePlan(data: DynamicObject): Promise<void> {
    const { offerId, type } = data;
    await PlanService.deletePlan(offerId, type);
  }
}
