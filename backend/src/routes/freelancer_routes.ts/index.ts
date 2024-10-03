import express from "express";
import portfolioRouter from "./freelancer_portfolio_route";
import profileStatisticRouter from "./freelancer_profile_statistic_route";
import educationRouter from "./freelancer_education_route";
import skillRouter from "./freelancer_skill_route";
import certificationRouter from "./freelancer_certification_route";
import offerRouter from "./offer_routes/index";
import detailsRouter from "./freelancer_details_route";
import offerStaticRouter from "./offer_statistic_route/offer_statistic_route";
import withdrawalRouter from "./freelancer_withdrawal_route";
const router = express.Router();

export default router.use(
  skillRouter,
  educationRouter,
  portfolioRouter,
  certificationRouter,
  profileStatisticRouter,
  offerRouter,
  offerStaticRouter,
  detailsRouter,
  withdrawalRouter
);
