import { Request, Response } from "express";
import { DynamicObject } from "../../../models/utilities/util";
import GalleryService from "../../../services/gallery_service";
import {
  uploadFile,
  uploadImages,
  uploadVideo,
} from "../../../utilities/functions";
import OfferService from "../../../services/offer_service";
import Media from "../../../models/utilities/file";

export default class OfferGalleryController {
  static async createGallery(req: Request, res: Response): Promise<void> {
    try {
      const offerId = req.params.offerId;

      // Get uploaded files from Multer fields
      const uploadedImages: Express.Multer.File[] =
        (req.files as { [fieldname: string]: Express.Multer.File[] })?.[
          "images"
        ] || [];
      const uploadedVideo: Express.Multer.File | undefined = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["video"]?.[0];
      const uploadDocFile: Express.Multer.File | undefined = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["document"]?.[0];

      const freelancerId = (await OfferService.getOffer(offerId))?.freelancerId
        ?.id!;

      // Upload images, video, and document if they exist
      const images = uploadedImages
        ? await uploadImages(uploadedImages, freelancerId, "offers")
        : [];
      const video = await uploadVideo(uploadedVideo, freelancerId, "offers");
      const document = await uploadFile(uploadDocFile, freelancerId, "offers");

      // Construct gallery object
      const galleryObject = {
        images: images,
        video: video !== null ? video : (undefined as Media | undefined),
        document:
          document !== null ? document : (undefined as Media | undefined),
      };
      // Create gallery
      await GalleryService.createGallery(offerId, galleryObject);

      // Send success response
      res.status(200).send({ message: "Offer Gallery created successfully" });
    } catch (error) {
      console.error("Failed to create offer Gallery:", error);
      res
        .status(500)
        .send({ message: "Failed to create offer Gallery", error: error });
    }
  }

  static async updateGallery(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;

    try {
      const freelancerId = (await OfferService.getOffer(offerId))?.freelancerId
        ?.id!;
      // Get uploaded files from Multer fields
      const uploadedImages: Express.Multer.File[] =
        (req.files as { [fieldname: string]: Express.Multer.File[] })?.[
          "images"
        ] || [];
      const uploadedVideo: Express.Multer.File | undefined = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["video"]?.[0];
      const uploadDocFile: Express.Multer.File | undefined = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["document"]?.[0];

      const images = uploadedImages
        ? await uploadImages(uploadedImages, freelancerId, "offers")
        : [];
      const video = await uploadVideo(uploadedVideo, freelancerId, "offers");
      const document = await uploadFile(uploadDocFile, freelancerId, "offers");

      let galleryObject = {
        images: images!,
        video: video!,
        document: document!,
      };
      console.log("update gallery");
      await GalleryService.updateGallery(offerId, galleryObject);
      res.status(200).send({ message: "Offer Gallery update successfully" });
    } catch (error) {
      console.error("Failed to update offer Gallery:", error);
      res
        .status(500)
        .send({ message: "Failed to update offer Gallery", error: error });
    }
  }

  static async addGalleryItem(
    data: DynamicObject,
    file: Express.Multer.File,
    type: string
  ): Promise<void> {
    const { freelancerId, offerId } = data;
    const media = (await uploadImages([file], freelancerId, "offers"))[0];
    switch (type) {
      case "image":
        await GalleryService.addImageItem(offerId, media);
        break;
      case "video":
        await GalleryService.addVideoItem(offerId, media);
        break;
      case "file":
        await GalleryService.addFileItem(offerId, media);
        break;
    }
  }
  static async deleteGalleryItem(req: Request, res: Response): Promise<void> {
    try {
      // Assuming the data to update the user is coming in the request body

      const offerId = req.params.offerId;
      const data: DynamicObject = req.body;
      const { name, type } = data;
      console.log(type);
      switch (true) {
        case type.startsWith("image/"):
          await GalleryService.rmImageItem(offerId, name);
          break;
        case type.startsWith("video/"):
          await GalleryService.rmVideoItem(offerId, name);
          break;
        case type.startsWith("application/"):
          await GalleryService.rmFileItem(offerId, name);
          break;
      }
      res
        .status(200)
        .send({ message: "offer Gallery delete item successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed offer Gallery to delete item",
        error: error!.toString(),
      });
    }
  }

  static async deleteGallery(offerId: string): Promise<void> {
    await GalleryService.deleteGallery(offerId);
  }
}
