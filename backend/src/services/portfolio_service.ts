import { DocumentReference, FieldValue } from "firebase-admin/firestore";
import { Portfolio, PortfolioItem } from "../models/portfolio"; // Import Portfolio and PortfolioItem classes
import generateRandomString from "../utilities/generate_string_function";
import admin, { firestore } from "../config/firebase.config";
import {
  DynamicObject,
  mapToFirestore,
  mapToFirestoreT2,
  withoutNulls,
} from "../models/utilities/util";
import { deleteFileFromFirebaseStorage } from "../utilities/firestorage_methods";
import { where } from "firebase/firestore";

const db = admin.firestore();

class PortfolioService {
  static collection = db.collection("portfolios");

  static portfolioConverter: firestore.FirestoreDataConverter<Portfolio> = {
    toFirestore(portfolio: Portfolio): firestore.DocumentData {
      return withoutNulls({
        portfolioId: portfolio.portfolioId,
        freelancerId: portfolio.freelancerId,
        portfolioItems: portfolio.portfolioItems.map((p) => p.toFirestore()),
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Portfolio {
      const data = snapshot.data();
      return new Portfolio(
        snapshot.id,
        data.freelancerId,
        data.portfolioItems,
        snapshot.ref
      );
    },
  };

  // Method to create a new Portfolio
  static async createPortfolio(
    freelancerId: DocumentReference,
    portfolioItems: PortfolioItem[] = []
  ): Promise<DocumentReference | null> {
    try {
      const portfolioId = this.collection
        .withConverter(this.portfolioConverter)
        .doc();
      const newPortfolioId = portfolioId.id;
      const newPortfolio = new Portfolio(
        newPortfolioId,
        freelancerId,
        portfolioItems,
        portfolioId
      );
      await portfolioId.set(newPortfolio);
      return portfolioId;
    } catch (e) {
      console.log(e);
      return null;
    }
    // Logic to save the newPortfolio to the database
  }
  static createPortfolioItem(item: DynamicObject): PortfolioItem {
    return new PortfolioItem({
      portfolioItemId: generateRandomString(),
      images: item!.images,
      videos: item!.videos,
      link: item!.linkUrl,
      title: item!.title,
      description: item!.description,
    });
  }
  // add Portfolio Item
  static async addItem(
    portfolio: Portfolio,
    portfolioItem: PortfolioItem
  ): Promise<void> {
    const newItem = portfolioItem.toFirestore(); // Serialize the new item

    // Update the document directly using arrayUnion
    await portfolio.documentRef?.update({
      portfolioItems: FieldValue.arrayUnion(newItem),
    });
  }
  static async getPortfolioItems(
    portfolioId: string
  ): Promise<PortfolioItem[] | undefined> {
    const portfolio = await this.getPortfolio(portfolioId);
    return portfolio?.portfolioItems;
  }

  static async removeItem(
    portfolio: Portfolio,
    portfolioItemId: string
  ): Promise<void> {
    const itemToRemove = portfolio.portfolioItems.find(
      (item) => item.portfolioItemId === portfolioItemId
    );

    // Check if the item to remove exists
    if (itemToRemove) {
      // Delete files associated with the item (if any)
      if (itemToRemove.images) {
        itemToRemove.images.forEach((image) =>
          deleteFileFromFirebaseStorage(image.url!)
        );
      }
      if (itemToRemove.videos) {
        itemToRemove.videos.forEach((video) =>
          deleteFileFromFirebaseStorage(video.url!)
        );
      }

      // Remove the item from the portfolioItems array in Firestore
      await portfolio.documentRef?.update({
        portfolioItems: FieldValue.arrayRemove(itemToRemove),
      });
    } else {
      console.log(`Item with portfolioItemId ${portfolioItemId} not found.`);
    }
  }

  static async getPortfolio(portfolioId: string): Promise<Portfolio | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.portfolioConverter)
        .doc(portfolioId)
        .get();
      const portfolioData = docSnapshot.data();
      if (docSnapshot.exists && portfolioData) {
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return portfolioData as Portfolio;
      } else {
        console.log("No such portfolio found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }
  static async getPortfolioByUserId(
    freelancerId: DocumentReference
  ): Promise<Portfolio | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.portfolioConverter)
        .where("freelancerId", "==", freelancerId)
        .get();

      const docs = docSnapshot.docs;
      if (docSnapshot.docs.length > 0) {
        return docs[0].data() as Portfolio;
      } else {
        console.log("No such portfolio found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }

  // Method to delete an existing Portfolio
  static async deletePortfolio(portfolioId: string): Promise<void> {
    const portfolio = await this.getPortfolio(portfolioId);
    portfolio?.documentRef?.delete();
  }
}

export default PortfolioService;
