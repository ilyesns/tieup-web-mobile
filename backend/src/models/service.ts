import { DocumentReference } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.config";
import {
  DynamicObject,
  classToApi,
  dateFromAlgolia,
  withoutNulls,
} from "./utilities/util";
import Media from "./utilities/file";

export default class Service {
  serviceId?: string;
  name?: string;
  description?: string;
  topic?: string;
  image?: string; // This could be a URL string pointing to the image location
  subServices?: DocumentReference[]; // List of sub-services which are also of type Service
  parentServiceId?: string | null; // This could be null if the service is a root service
  isRoot?: boolean; // Flag to indicate if this is a root service
  createdAt?: Date; // Flag to indicate if this is a root service
  createdBy?: DocumentReference;
  documentRef?: DocumentReference;
  constructor({
    serviceId,
    name,
    description,
    topic,
    image,
    createdAt,
    subServices = [],
    parentServiceId = null,
    isRoot = false,
    createdBy,
    documentRef,
  }: {
    serviceId?: string;
    name?: string;
    description?: string;
    topic?: string;
    image?: string;
    createdAt?: Date;
    subServices?: DocumentReference[];
    createdBy?: DocumentReference;
    documentRef?: DocumentReference;
    parentServiceId?: string | null;
    isRoot?: boolean;
  }) {
    this.serviceId = serviceId;
    this.name = name;
    this.description = description;
    this.topic = topic;
    this.createdAt = createdAt;
    this.image = image;
    this.subServices = subServices;
    this.parentServiceId = parentServiceId;
    this.isRoot = isRoot;
    this.createdBy = createdBy;
    this.documentRef = documentRef;
  }

  toFirestoreObject(): firestore.DocumentData {
    return withoutNulls({
      serviceId: this.serviceId,
      name: this.name,
      description: this.description,
      topic: this.topic,
      image: this.image,
      created_at: this.createdAt,
      subServices: this.subServices,
      parentServiceId: this.parentServiceId,
      createdBy: this.createdBy,
      isRoot: this.isRoot,
    });
  }
  static fromAlgolia(data: DynamicObject): Service {
    return new Service({
      serviceId: data.serviceId,
      name: data.name,
      description: data.description,
      topic: data.topic,
      image: data.image,
      subServices: data.subServices,
      parentServiceId: data.parentServiceId,
      isRoot: data.isRoot,
      createdBy: data.createdBy,
      createdAt: dateFromAlgolia(data.created_at),
      documentRef: data.path.match(/\/(.*)$/)[1],
    });
  }

  static async ServiceToApi(s: Service) {
    return await classToApi(s);
  }
  // Methods to manage service data could be added here, or in a separate service class
}
