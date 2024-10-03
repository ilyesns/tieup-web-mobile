import { DocumentReference } from "firebase-admin/firestore";
import { DynamicObject, classToApi } from "../../models/utilities/util";
import UserService from "../../services/user_service";
import PortfolioService from "../../services/portfolio_service";
import { Portfolio, PortfolioItem } from "../../models/portfolio";
import {
  uploadFilesToFirebaseStorage,
  uploadToFirebaseStorage,
} from "../../utilities/firestorage_methods";
import Media from "../../models/utilities/file";
import {
  uploadImages,
  uploadVideo,
  uploadVideos,
} from "../../utilities/functions";
import { Request, Response } from "express";

export default class FreelancerPortfolioController {
  static async addPorfolioItem(req: Request, res: Response): Promise<void> {
    const freelancerId = req.params.freelancerId;
    const { title, description, link } = req.body;
    try {
      const uploadedImages: Express.Multer.File[] =
        (req.files as { [fieldname: string]: Express.Multer.File[] })?.[
          "images"
        ] || [];
      const uploadedVideos: Express.Multer.File[] =
        (req.files as { [fieldname: string]: Express.Multer.File[] })?.[
          "videos"
        ] || [];

      const freelancerRef = UserService.collection.doc(freelancerId);
      const images = uploadedImages
        ? await uploadImages(uploadedImages, freelancerId, "portfolio")
        : [];
      const videos = await uploadVideos(
        uploadedVideos,
        freelancerId,
        "portfolio"
      );
      const portfolio = await PortfolioService.getPortfolioByUserId(
        freelancerRef
      );
      const newPortfolioItems = PortfolioService.createPortfolioItem({
        description: description,
        title: title,
        link: link,
        videos: videos,
        images: images,
      });

      if (portfolio) {
        await PortfolioService.addItem(portfolio, newPortfolioItems);
      } else {
        const newPortfolio = await PortfolioService.createPortfolio(
          freelancerRef,
          [newPortfolioItems]
        );
      }

      res.status(200).send({ message: "Portfolio item created successfully" });
    } catch (error) {
      console.error("Failed to create Portfolio item:", error);
      res
        .status(500)
        .send({ message: "Failed to create Portfolio item", error: error });
    }
  }

  static async getFreelancerPortfolio(
    req: Request,
    res: Response
  ): Promise<void> {
    const freelancerId = req.params.freelancerId;

    const freelancerRef = UserService.collection.doc(freelancerId);
    try {
      const portfolio = await PortfolioService.getPortfolioByUserId(
        freelancerRef
      );

      if (!portfolio) {
        res.status(204).send({ message: "Portfolio not found" });
        return;
      }

      const portfolioToApi = await classToApi(portfolio);
      res.status(200).json(portfolioToApi);
    } catch (error) {
      res.status(500).send({
        message: "Error fetching portfolio" + error,
      });
      console.error("Error fetching portfolio:", error);
    }
  }
  static async processFreelancerPortfolioItem(
    freelancerId: string,
    portfolioItemData: DynamicObject,
    files: Map<string, Express.Multer.File[]>
  ): Promise<void> {
    const freelancerRef = UserService.collection.doc(freelancerId);
    const portfolio = await PortfolioService.getPortfolioByUserId(
      freelancerRef
    );
    if (!portfolio) throw new Error("No such portfolio exists!");

    const images = files.get("images")
      ? await uploadImages(
          files.get("images")!,
          freelancerId,
          "freelancers_portfolio"
        )
      : [];
    const video = files.get("video")
      ? await uploadVideo(
          files.get("video")![0],
          freelancerId,
          "freelancers_portfolio"
        )
      : null;

    let portfolioItemObject = {
      title: portfolioItemData.title,
      description: portfolioItemData.description,
      images: images,
      video: video,
      link: portfolioItemData.link,
    };

    // This could either create a new item or update an existing one, depending on implementation
    const portfolioItem =
      PortfolioService.createPortfolioItem(portfolioItemObject);
    await PortfolioService.addItem(portfolio, portfolioItem);
  }

  static async deletePortfolioItem(req: Request, res: Response) {
    try {
      const freelancerId = req.params.freelancerId;
      const { itemId } = req.body;
      const freelancerRef = UserService.collection.doc(freelancerId);
      const portfolio = await PortfolioService.getPortfolioByUserId(
        freelancerRef
      );
      await PortfolioService.removeItem(portfolio!, itemId);

      res
        .status(200)
        .send({ message: "freelancer portfolio item deleted  successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed freelancer portfolio to delete item",
        error: error!.toString(),
      });
    }
  }
}
