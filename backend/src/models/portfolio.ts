import { DocumentReference } from "firebase-admin/firestore";
import { doc } from "firebase/firestore";
import { DynamicObject, withoutNulls } from "./utilities/util";
import Media from "./utilities/file";

class PortfolioItem {
  portfolioItemId?: string;
  images?: Media[]; // List of image URLs
  videos?: Media[]; // URL to a video
  link?: string; // Link URL
  title?: string; // Title of the portfolio item
  description?: string; // Description of the portfolio item

  constructor({
    portfolioItemId,
    images,
    videos,
    link,
    title,
    description,
  }: {
    portfolioItemId?: string;
    images?: Media[];
    videos?: Media[];
    link?: string;
    title?: string;
    description?: string;
  }) {
    this.portfolioItemId = portfolioItemId;
    this.images = images;
    this.videos = videos;
    this.link = link;
    this.title = title;
    this.description = description;
  }
  toFirestore() {
    return withoutNulls({
      portfolioItemId: this.portfolioItemId,
      images: this.images?.map((i) => i.toFirestore()),
      videos: this.videos?.map((v) => v.toFirestore()),
      link: this.link,
      title: this.title,
      description: this.description,
    });
  }
  static fromFirestore(data: DynamicObject) {
    return new PortfolioItem({
      portfolioItemId: data.portfolioItemId,
      images: data.images,
      videos: data.videos,
      link: data.link,
      title: data.title,
      description: data.description,
    });
  }
}

class Portfolio {
  portfolioId: string;
  portfolioItems: PortfolioItem[];
  freelancerId: DocumentReference;
  documentRef?: DocumentReference;
  // ID of the freelancer to whom this portfolio belongs

  constructor(
    portfolioId: string,
    freelancerId: DocumentReference,
    portfolioItems: PortfolioItem[] = [],
    documentRef?: DocumentReference
  ) {
    this.portfolioId = portfolioId;
    this.freelancerId = freelancerId;
    this.portfolioItems = portfolioItems;
    this.documentRef = documentRef;
  }

  toFirestore() {
    return withoutNulls({
      portfolioId: this.portfolioId,
      portfolioItems: this.portfolioItems.map((p) => p.toFirestore()),
      freelancerId: this.freelancerId,
    });
  }
}

export { Portfolio, PortfolioItem };
