import express, { Express, Request, Response } from "express";

import userRouter from "./src/routes/user_route";
import freelancerRouter from "./src/routes/freelancer_routes.ts";
import cors from "cors";
import adminService from "./src/routes/admin_routes/admin_service_route";
import serviceRouter from "./src/routes/services_routes/index";
import chatRouter from "./src/routes/chat_routes/chat_route";
import orderRouter from "./src/routes/order_routes/index";
import reviewRouter from "./src/routes/review_routes/index";
import revisionRouter from "./src/routes/revision_routes/index";
import notificationRouter from "./src/routes/user_notification_routes/user_notification";
import walletRouter from "./src/routes/wallet_routes/index";
import offerRouter from "./src/routes/offer_routes/offer_route";
import adminRouter from "./src/routes/admin_routes/index";

import authLinkedIn from "./src/auth/linked_auth";

const app = express();
app.use(express.json()); // This line is necessary to parse JSON request bodies
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/freelancer", freelancerRouter);
app.use("/api/service", serviceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/revision", revisionRouter);
app.use("/api/", notificationRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/offer", offerRouter);
app.use("/api/admin", adminRouter);
app.use("/auth", authLinkedIn);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
