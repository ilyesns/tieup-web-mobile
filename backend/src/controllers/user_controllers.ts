import { DocumentReference } from "firebase-admin/firestore";
import { DynamicObject, classToApi } from "../models/utilities/util";
import ClientService from "../services/client_service";
import UserService from "../services/user_service";
import { AdminRole, Role, SellerLevel, TypeUser } from "../utilities/enums";
import FreelancerService from "../services/freelancer_service";
import { uploadToFirebaseStorage } from "../utilities/firestorage_methods";
import EmailSender from "../utilities/email_sender";
import User from "../models/user";
import FreelancerProfileStatisticsService from "../services/freelancer_profile_statistics_service";
import WalletFreelancerService from "../services/wallet_freelancer_service";
import express, { Request, Response } from "express";
import { generateUserName } from "../utilities/functions";
import Wallet from "../models/wallet";
import WalletService from "../services/wallet_service";

export default class UserController {
  static async createUser(
    data: DynamicObject
  ): Promise<DocumentReference | null> {
    if (!data.userId) {
      throw new Error("Missing document ID.");
    }
    console.log(data);
    try {
      const userRef = await UserService.createUser({
        userUid: data.userId,
        username: generateUserName(data.firstName!, data.lastName!) ?? "",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        typeUser: TypeUser.User,
        role: Role.Client,
      });
      await WalletService.createWallet({
        userId: userRef!,
        balance: 0,
      });
      return userRef;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  static async mayBeCreateUser(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const data: DynamicObject = req.body;
      if (!data) throw "Missing Doc Id";
      let check = await UserService.getUser(data.userId);

      let userRef = null;
      let message = "User doc already created";
      if (check == null) {
        try {
          userRef = await UserService.createUser({
            userUid: data.userId,
            username: generateUserName(data.firstName!, data.lastName!) ?? "",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            photoURL: data.photoURL,
            typeUser: TypeUser.User,
            role: Role.Client,
          });
          await WalletService.createWallet({
            userId: userRef!,
            balance: 0,
          });
          message = "User create successfully";
        } catch (e) {
          console.log(e);
        }
      }

      res.status(200).send({ message: message });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to create the user",
        error: error!.toString(),
      });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const data: DynamicObject = req.body;
      if (!userId) {
        throw new Error("Missing document ID.");
      }
      console.log(data);
      const user = await UserService.getUser(userId);
      if (user!.role === Role.Client) {
        await ClientService.updateClient(data, userId);
      } else if (user!.role === Role.Freelancer) {
        await FreelancerService.updateFreelancer(data, userId);
      } else {
        await ClientService.updateClient(data, userId);
      }
      res.status(200).send({ message: "User update successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to update the user",
        error: error!.toString(),
      });
    }
  }

  static async deleteAccount(data: DynamicObject): Promise<void> {
    if (!data.userId) {
      throw new Error("Missing document ID.");
    }
    try {
      await UserService.delete(data);
    } catch (e) {
      console.log(e);
    }
  }
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId = req.params.userId;

      if (!userId) throw "Missing Doc data";
      const userRole = (await UserService.getUser(userId))?.role;
      let user;

      switch (userRole) {
        case Role.Client:
          user = await ClientService.getClient(userId)!;
          break;
        case Role.Freelancer:
          user = await FreelancerService.getFreelancer(userId)!;
          break;

        default:
          user = await ClientService.getClient(userId);
          break;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Failed to get the user", error: error!.toString() });
    }
  }
  static async uploadPhoto(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const userId = req.params.userId;
      if (!userId) throw "Missing Doc Id";
      const userRef = UserService.collection.doc(userId);

      if (!userRef) throw new Error("user not found");
      const { fileName, size, publicUrl, type } = await uploadToFirebaseStorage(
        file!,
        userId,
        "users"
      );

      await userRef?.update({ photoURL: publicUrl });

      res.status(200).send({ message: "User photo successfully" });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to update the user",
        error: error!.toString(),
      });
    }
  }

  static async sendVerificationEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId: string = req.params.userId;
      let user = await UserService.getUser(userId);
      let link = await UserService.getEmailVerificationLink(user?.email!);
      console.log(user?.email);
      const emailSender = new EmailSender(
        "start.tieup@gmail.com",
        "rafh zprh mwrk sfol"
      );
      const emailOptions = {
        to: user?.email!,
        subject: "Verify Your Email",
        html: ` <div class="container">
            <h2>Verify Your Email Address</h2>
            <p>Please click the button below to verify your email address and complete your signup process.</p>
            <p><a href="${link}" class="button">Verify Email!</a></p>
            <p>If you did not request this, please ignore this email.</p>
        </div>`, // This is where your email template would go
      };
      await emailSender.sendEmailWithTemplate(emailOptions);
      res.status(200).send({ message: "Email sent!" });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to send email verification the user",
        error: error!.toString(),
      });
    }
  }

  // static async sendEmailResetPassword(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   try {
  //     // Assuming the data to update the user is coming in the request body
  //     const email: string = req.params.email;
  //     const emailSender = new EmailSender(
  //       "start.tieup@gmail.com",
  //       "rafh zprh mwrk sfol"
  //     );

  //     const emailOptions = {
  //       to: email,
  //       subject: 'Reset Your Password',
  //       html: `<div class="container">
  //               <h2>Reset Your Password</h2>
  //               <p>Please click the button below to reset your password.</p>
  //               <p><a href="${resetLink}" class="button">Reset Password</a></p>
  //               <p>If you did not request this, please ignore this email.</p>
  //             </div>`, // Your email template
  //     };
  //     await emailSender.sendEmailWithTemplate(emailOptions);
  //     res.status(200).send({ message: "Email sent!" });
  //   } catch (error) {
  //     // Log the error and send an error response
  //     console.error(error);
  //     res.status(500).send({
  //       message: "Failed to send email verification the user",
  //       error: error!.toString(),
  //     });
  //   }
  // }

  static async changePassword(data: DynamicObject): Promise<void> {
    await UserService.changePassword(data);
  }
  static async switchRole(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId: string = req.params.userId;

      if (!userId) throw "Missing Doc Id";

      await ClientService.switchRole(userId);
      res.status(200).send({ message: "User switch role successfully" });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to switch role the user",
        error: error!.toString(),
      });
    }
  }
  static async becomeFreelancer(req: Request, res: Response): Promise<void> {
    try {
      const data: DynamicObject = req.body;
      const userId = req.params.userId;
      if (!data) throw "Missing Doc Id";
      const user = await UserService.getUser(userId);

      await FreelancerService.createFreelancerDetainsField(
        user?.documentId!,
        data
      );
      const statistic = await FreelancerProfileStatisticsService.getStatistics(
        user?.documentId!
      );

      if (statistic == null) {
        const walletRef = (
          await WalletService.getWalletByUser(user?.documentId!)
        )?.documentRef!;

        await WalletFreelancerService.updateWalletFreelancer(walletRef.id, {
          balance: 0,
          earningsInMonth: 0,
          pendingClearance: 0,
        });

        await FreelancerProfileStatisticsService.createStatistics({
          freelancerId: user?.documentId!,
          sellerLevel: SellerLevel.Bronze,
          responseTime: 0,
          nextEvaluationDate: new Date(),
          onTimeDeliveryRate: 0,
          orderCompletionRate: 0,
          positiveRatingPercentage: 0,
        });
      }

      res
        .status(200)
        .send({ message: "Become Freelancer has been with successfully" });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to switch role the user",
        error: error!.toString(),
      });
    }
  }
  static async updateFreelancerField(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data: DynamicObject = req.body;
      const userId = req.params.userId;
      if (!data) throw "Missing Doc Id";
      await FreelancerService.updateFreelancerField(data, userId);
      res.status(200).send({
        message: "Update Freelancer field has been with successfully",
      });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to switch role the user",
        error: error!.toString(),
      });
    }
  }

  static async searchUser(data: DynamicObject): Promise<User[] | null> {
    const { term } = data;
    return await UserService.search(term);
  }

  static async getFreelancer(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body
      const userId = req.params.userId;

      if (!userId) throw "Missing Doc data";

      const freelancer = await FreelancerService.getFreelancer(userId)!;
      const freelancerWithApi = await classToApi(freelancer!);

      res.status(200).json(freelancerWithApi);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to get the freelancer profile",
        error: error!.toString(),
      });
    }
  }
}
