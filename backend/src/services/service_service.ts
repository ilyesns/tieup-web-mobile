import admin, { firestore } from "../config/firebase.config";
import { DocumentReference } from "firebase-admin/firestore";
import Service from "../models/service";
import { withoutNulls } from "../models/utilities/util";
import Media from "../models/utilities/file";
import AlgoliaManager from "../utilities/search_algolia/algolia_manager";
import { areSameDocument } from "../utilities/util";
import { deleteFileFromFirebaseStorage } from "../utilities/firestorage_methods";
const db = admin.firestore();

class ServiceService {
  static collection = db.collection("services");

  static serviceConverter: firestore.FirestoreDataConverter<Service> = {
    toFirestore(service: Service): firestore.DocumentData {
      return withoutNulls({
        serviceId: service.serviceId,
        name: service.name,
        description: service.description,
        topic: service.topic,
        image: service.image,
        subServices: service.subServices,
        parentServiceId: service.parentServiceId,
        isRoot: service.isRoot,
        createdBy: service.createdBy,
        created_at: service.createdAt,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Service {
      const data = snapshot.data();
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
        createdAt: data.createdAt,
        documentRef: snapshot.ref,
      });
    },
  };

  static async createService(serviceData: {
    name?: string;
    description?: string;
    image?: string;
    topic?: string;
    createdBy?: DocumentReference;
    parentServiceId?: string;
    isRoot: boolean;
  }): Promise<DocumentReference> {
    const newServiceRef = this.collection
      .withConverter(this.serviceConverter)
      .doc();
    let id;
    if (serviceData.isRoot == true) id = null;
    else id = serviceData.parentServiceId;

    const newService = new Service({
      serviceId: newServiceRef.id,
      name: serviceData.name,
      description: serviceData.description,
      topic: serviceData.topic,
      image: serviceData.image,
      isRoot: serviceData.isRoot,
      createdBy: serviceData.createdBy,
      parentServiceId: id,
      createdAt: new Date(),
      documentRef: newServiceRef,
    });

    await newServiceRef.set(newService);

    return newServiceRef;
  }
  static async updateService(
    serviceId: string,
    updatedData: Partial<Service>
  ): Promise<void> {
    const serviceRef = (await this.getService(serviceId))?.documentRef;
    const newOffer = new Service({ ...updatedData }).toFirestoreObject();
    try {
      await serviceRef!.update(newOffer);
    } catch (e) {
      console.log(e);
    }
  }
  static async updateServiceImage(
    serviceId: string,
    image: string
  ): Promise<void> {
    const serviceRef = (await this.getService(serviceId))?.documentRef;
    try {
      await serviceRef!.update({ image: image });
    } catch (e) {
      console.log(e);
    }
  }
  static async deleteService(service: Service): Promise<void> {
    await deleteFileFromFirebaseStorage(service.image!);
    await service.documentRef!.delete();
  }
  static async addSubService(
    serviceId: DocumentReference,
    parentServiceId: string
  ): Promise<void> {
    const service = await this.getService(parentServiceId);
    const subServices = service?.subServices;
    subServices?.push(serviceId);
    try {
      await service?.documentRef!.update({ subServices: subServices });
    } catch (e) {
      console.log(e);
    }
  }
  static async removeSubService(
    serviceId: DocumentReference,
    parentServiceId: string
  ): Promise<void> {
    const service = await this.getService(parentServiceId);

    await service
      ?.documentRef!.withConverter(this.serviceConverter)
      .update({ subServices: firestore.FieldValue.arrayRemove(serviceId) });
  }
  static async getService(serviceId: string): Promise<Service | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.serviceConverter)
        .doc(serviceId)
        .get();
      const serviceData = docSnapshot.data();
      if (docSnapshot.exists && serviceData) {
        return serviceData as Service;
      } else {
        console.log("No such Service found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  Service:", error);
      return null;
    }
  }
  static async getAllServices(serviceId?: string): Promise<Service[] | null> {
    try {
      let docSnapshot;
      if (serviceId) {
        const serviceRef = this.collection.doc(serviceId);
        docSnapshot = await this.collection
          .withConverter(this.serviceConverter)
          .where("parentServiceId", "==", serviceRef)
          .get();
      } else
        docSnapshot = await this.collection
          .withConverter(this.serviceConverter)
          .get();
      if (!docSnapshot.empty) {
        const serviceData = docSnapshot.docs.map((e) => e.data());

        return serviceData as Service[];
      } else {
        console.log("No  Services found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  Services:", error);
      return null;
    }
  }
  static async search(term: string): Promise<Service[] | null> {
    const services = await AlgoliaManager.getInstance().algoliaQuery({
      index: "services",
      term: term,
      useCache: false,
    });

    return services.map((e) => Service.fromAlgolia(e));
  }
}

export default ServiceService;
