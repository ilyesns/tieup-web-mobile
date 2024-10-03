import { DocumentReference } from "firebase-admin/firestore";
import { Plan } from "./plan";
import { OfferStatus } from "../utilities/enums";
import { Gallery } from "./gallery";
import { firestore } from "../config/firebase.config";
import { DynamicObject, dateFromAlgolia } from "./utilities/util";
import UserService from "../services/user_service";
import ServiceService from "../services/service_service";

interface OfferData {
  offerId?: string;
  freelancerId?: DocumentReference;
  title?: string;
  description?: string;
  serviceName?: string;
  serviceId?: DocumentReference;
  subServiceName?: string;
  subServiceId?: DocumentReference;
  basicPlan?: Plan;
  premiumPlan?: Plan;
  status?: OfferStatus;
  documentRef?: DocumentReference;
  gallery?: Gallery;
  createdAt?: Date;
}

class Offer {
  offerId?: string;
  freelancerId?: DocumentReference;
  title?: string;
  description?: string;
  serviceName?: string;
  serviceId?: DocumentReference;
  subServiceName?: string;
  subServiceId?: DocumentReference;
  basicPlan?: Plan;
  premiumPlan?: Plan;
  status?: OfferStatus;
  documentRef?: DocumentReference;
  gallery?: Gallery;
  createdAt?: Date;

  constructor({
    offerId,
    freelancerId,
    title,
    description,
    serviceId,
    serviceName,
    subServiceName,
    subServiceId,
    basicPlan,
    premiumPlan,
    status,
    documentRef,
    gallery,
    createdAt,
  }: OfferData) {
    this.offerId = offerId;
    this.freelancerId = freelancerId;
    this.title = title;
    this.description = description;
    this.serviceName = serviceName;
    this.serviceId = serviceId;
    this.subServiceName = subServiceName;
    this.subServiceId = subServiceId;
    this.basicPlan = basicPlan;
    this.premiumPlan = premiumPlan;
    this.status = status;
    this.documentRef = documentRef;
    this.gallery = gallery;
    this.createdAt = createdAt;
  }

  toFirestoreObject(): firestore.DocumentData {
    return {
      offerId: this.offerId,
      freelancerId: this.freelancerId,
      title: this.title,
      description: this.description,
      serviceName: this.serviceName,
      serviceId: this.serviceId,
      subServiceName: this.subServiceName,
      subServiceId: this.subServiceId,
      basicPlan: this.basicPlan ? this.basicPlan.toFirestore() : null, // Assuming you have a method to convert plans to Firestore objects
      premiumPlan: this.premiumPlan ? this.premiumPlan.toFirestore() : null,
      status: this.status,
      gallery: this.gallery,
      createdAt: this.createdAt, // Make sure this is in a format Firestore can store, e.g., Firestore.Timestamp
    };
  }
  static fromAlgolia(data: DynamicObject): Offer {
    return new Offer({
      offerId: data.offerId,
      freelancerId: UserService.collection.doc(data.freelancerId.split("/")[1]),
      title: data.title,
      description: data.description,
      serviceName: data.serviceName,
      serviceId: ServiceService.collection.doc(data.serviceId.split("/")[1]),
      subServiceName: data.subServiceName,
      subServiceId: ServiceService.collection.doc(
        data.subServiceId.split("/")[1]
      ),
      basicPlan: Plan.fromFirestore(data.basicPlan),
      premiumPlan: Plan.fromFirestore(data.premiumPlan),
      status: data.status,
      gallery: data.gallery,
      documentRef: data.path,
      createdAt: dateFromAlgolia(data.createdAt),
    });
  }
}

export { Offer, OfferData };
