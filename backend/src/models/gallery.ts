import { firestore } from "../config/firebase.config";
import { deleteFileFromFirebaseStorage } from "../utilities/firestorage_methods";
import Media, { MediaData } from "./utilities/file";
import { DynamicObject, withoutNulls } from "./utilities/util";

interface galleryData {
  images?: Media[];
  video?: Media;
  document?: Media;
}

class Gallery {
  images?: Media[];
  video?: Media;
  document?: Media;

  constructor({
    images = [],
    video,
    document,
  }: {
    galleryId?: string;
    images?: Media[];
    video?: Media;
    document?: Media;
  }) {
    this.images = images;
    this.video = video;
    this.document = document;
  }
  toFirestore(): firestore.DocumentData {
    return withoutNulls({
      images: this.images?.map((img) => img.toFirestore()) ?? [],
      video: this.video?.toFirestore(),
      document: this.document?.toFirestore(),
    });
  }
  static fromFirestore(data: galleryData) {
    return new Gallery({
      images:
        data.images
          ?.map((imgData: MediaData) =>
            imgData ? Media.fromFirestore(imgData) : null
          )
          .filter((img): img is Media => img !== null) ?? [],
      video: data.video ? Media.fromFirestore(data.video) : undefined,
      document: data.document ? Media.fromFirestore(data.document) : undefined,
    });
  }

  static mergeGalleries(
    oldGallery: Partial<Gallery>,
    newGallery: Partial<Gallery>
  ): Gallery {
    // Merge Gallery data, giving precedence to newGallery fields
    const mergedGalleryData: Partial<Gallery> = {
      ...oldGallery,
      ...newGallery,
      images: [...(oldGallery.images || []), ...(newGallery.images || [])],
      video: newGallery.video ? newGallery.video : oldGallery.video,
      document: newGallery.document ? newGallery.document : oldGallery.document,
    };

    // Create a new Gallery instance with the merged data
    return new Gallery(mergedGalleryData);
  }
  static removeFieldFromMediaArray(
    gallery: Gallery,
    fieldToRemove: "image" | "file" | "video",
    name: string
  ) {
    if (fieldToRemove === "image") {
      const url = gallery.images?.find((i) => i.name === name)?.url;
      console.log(url);
      deleteFileFromFirebaseStorage(url!);
      gallery.images = gallery.images?.filter((img) => img.name !== name);
    } else if (fieldToRemove === "video") {
      deleteFileFromFirebaseStorage(gallery.video?.url!);
      gallery.video = undefined;
    } else {
      deleteFileFromFirebaseStorage(gallery.document?.url!);
      gallery.document = undefined;
    }
    return gallery;
  }
}
export { galleryData, Gallery };
