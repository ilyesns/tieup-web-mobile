import express, { Request, Response } from "express";
import { DynamicObject } from "../../../models/utilities/util";
import OfferGalleryController from "../../../controllers/freelancer_controllers/offer_controllers/freelancer_offer_gallery_contollers";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

// Create a new router
const router = express.Router();

router.post(
  "/add-gallery/:offerId",
  upload.fields([
    { name: "images", maxCount: 10 }, // Allow up to 10 image files
    { name: "video", maxCount: 1 }, // Allow only 1 video file
    { name: "document", maxCount: 1 }, // Allow only 1 document file
  ]),
  OfferGalleryController.createGallery
);

router.post(
  "/update-gallery/:offerId",
  upload.fields([
    { name: "images", maxCount: 10 }, // Allow up to 10 image files
    { name: "video", maxCount: 1 }, // Allow only 1 video file
    { name: "document", maxCount: 1 }, // Allow only 1 document file
  ]),
  OfferGalleryController.updateGallery
);

router.post(
  "/add-gallery-item",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      // Assuming the data to update the user is coming in the request body
      const file: Express.Multer.File = req.file as Express.Multer.File;

      const data: DynamicObject = req.body;
      if (!data) throw new Error("Missing Doc data");

      let type = "";

      // Iterate over files and classify them as image or video based on mimetype
      if (file.mimetype.startsWith("image/")) {
        type = "image";
      } else if (file.mimetype.startsWith("video/")) {
        type = "video";
      } else {
        type = "file";
      }

      await OfferGalleryController.addGalleryItem(data, file, type);
      res
        .status(200)
        .send({ message: "offer Gallery item added  successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "failed offer Gallery to add item",
        error: error!.toString(),
      });
    }
  }
);

router.post(
  "/delete-gallery-item/:offerId",
  OfferGalleryController.deleteGalleryItem
);
router.post("/delete-gallery/:offerId", async (req: Request, res: Response) => {
  try {
    const offerId: string = req.params.offerId;

    await OfferGalleryController.deleteGallery(offerId);
    res.status(200).send({ message: "offer Gallery delete item successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "failed freelancer gallery to delete item",
      error: error!.toString(),
    });
  }
});

export default router;
