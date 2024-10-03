import { Gallery, galleryData } from "../models/gallery";
import Media from "../models/utilities/file";
import { DocumentReference } from "firebase-admin/firestore";
import OfferService from "./offer_service";
import admin from "../config/firebase.config";
import { deleteFileFromFirebaseStorage } from "../utilities/firestorage_methods";
class GalleryService {
  static async createGallery(
    offerId: string,
    galleryData: galleryData
  ): Promise<void> {
    const offerRef = await OfferService.getOffer(offerId);
    const gallery = new Gallery({ ...galleryData }).toFirestore();
    await offerRef?.documentRef!.set({ gallery: gallery }, { merge: true });
  }

  static async updateGallery(
    offerId: string,
    galleryData: galleryData
  ): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      this.createGallery(offerId, galleryData);
    } else {
      const oldGalleryData = Gallery.fromFirestore(offer?.gallery);

      const updatedGallery = Gallery.mergeGalleries(
        oldGalleryData,
        galleryData
      ).toFirestore();
      console.log(galleryData);

      await offer?.documentRef!.set(
        { gallery: updatedGallery },
        { merge: true }
      );
    }
  }
  static async addImageItem(offerId: string, item: Media): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const images = [item].concat(oldGalleryData.images ?? []);
    const updatedGallery = Gallery.mergeGalleries(oldGalleryData, {
      images,
    }).toFirestore();
    await offer?.documentRef!.set({ gallery: updatedGallery }, { merge: true });
  }
  static async addVideoItem(offerId: string, item: Media): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const updatedGallery = Gallery.mergeGalleries(oldGalleryData, {
      video: item,
    }).toFirestore();
    await offer?.documentRef!.set({ gallery: updatedGallery }, { merge: true });
  }

  static async addFileItem(offerId: string, item: Media): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const updatedGallery = Gallery.mergeGalleries(oldGalleryData, {
      document: item,
    }).toFirestore();

    await offer?.documentRef!.set({ gallery: updatedGallery }, { merge: true });
  }
  static async rmImageItem(offerId: string, name: string): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const updatedGallerys = Gallery.removeFieldFromMediaArray(
      oldGalleryData,
      "image",
      name
    ).toFirestore();
    await offer?.documentRef!.set(
      { gallery: updatedGallerys },
      { merge: true }
    );
  }
  static async rmVideoItem(offerId: string, name: string): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const updatedGallerys = Gallery.removeFieldFromMediaArray(
      oldGalleryData,
      "video",
      name
    ).toFirestore();
    await offer?.documentRef!.update({ gallery: updatedGallerys });
  }
  static async rmFileItem(offerId: string, name: string): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (!offer || !offer.gallery) {
      throw new Error("Offer or gallery not found");
    }
    const oldGalleryData = Gallery.fromFirestore(offer?.gallery);
    const updatedGallerys = Gallery.removeFieldFromMediaArray(
      oldGalleryData,
      "file",
      name
    ).toFirestore();
    await offer?.documentRef!.update({ gallery: updatedGallerys });
  }

  static async deleteGallery(offerId: string): Promise<void> {
    const offer = await OfferService.getOffer(offerId);
    if (offer?.gallery) {
      const gallery = Gallery.fromFirestore(offer?.gallery!);
      if (gallery.images)
        gallery.images?.forEach((e) => deleteFileFromFirebaseStorage(e.url!));
      if (gallery.video) deleteFileFromFirebaseStorage(gallery.video?.url!);
      if (gallery.document)
        deleteFileFromFirebaseStorage(gallery.document?.url!);
      await offer?.documentRef!.update({
        gallery: admin.firestore.FieldValue.delete(),
      });
    }
  }
}

export default GalleryService;
