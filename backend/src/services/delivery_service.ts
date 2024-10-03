import { DocumentReference } from "firebase-admin/firestore";
import Delivery from "../models/delivery";
import admin, { firestore } from "../config/firebase.config";
import { dateToFirestore, withoutNulls } from "../models/utilities/util";
import Media from "../models/utilities/file";

const db = admin.firestore();

class DeliveryService {
  static deliveryConverter: firestore.FirestoreDataConverter<Delivery> = {
    toFirestore(delivery: Delivery): firestore.DocumentData {
      return withoutNulls({
        deliveryId: delivery.deliveryId,
        file: delivery.file?.toFirestore(),
        deliveryDate: dateToFirestore(delivery.deliveryDate),
        orderId: delivery.orderId,
        note: delivery.note,
        deliveryNumber: delivery.deliveryNumber,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Delivery {
      const data = snapshot.data();
      return new Delivery({
        deliveryId: snapshot.id,
        file: data.file,
        deliveryDate: data.deliveryDate,
        orderId: data.orderId,
        note: data.note,
        deliveryNumber: data.deliveryNumber,
        documentRef: snapshot.ref,
      });
    },
  };

  static getDeliveriesForOrder(orderId: string) {
    const orderDeliveriesCollection = db.collection(
      `orders/${orderId}/deliveries`
    );
    return orderDeliveriesCollection;
  }
  static async createDelivery(deliveryData: {
    file: Media;
    deliveryDate: Date;
    orderId: DocumentReference;
    note: string;
    deliveryNumber: number;
  }): Promise<DocumentReference | null> {
    const deliveryId = this.getDeliveriesForOrder(deliveryData.orderId.id)
      .withConverter(this.deliveryConverter)
      .doc();
    const newDeliveryId = deliveryId.id;
    const newDelivery = new Delivery({
      deliveryId: deliveryId.id,
      file: deliveryData.file,
      deliveryDate: deliveryData.deliveryDate,
      orderId: deliveryData.orderId,
      note: deliveryData.note,
      deliveryNumber: deliveryData.deliveryNumber,
      documentRef: deliveryId,
    });

    await deliveryId.set(newDelivery);
    return deliveryId;
  }

  static async getDelivery(
    orderId: string,
    deliveryId: string
  ): Promise<Delivery | null> {
    try {
      const docSnapshot = await this.getDeliveriesForOrder(orderId)
        .withConverter(this.deliveryConverter)
        .doc(deliveryId)
        .get();
      const deliveryData = docSnapshot.data();
      if (docSnapshot.exists && deliveryData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return deliveryData as Delivery;
      } else {
        console.log("No such Delivery found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Delivery:", error);
      return null;
    }
  }

  static async getAllDeliveryByOrderId(
    orderId: string
  ): Promise<Delivery[] | []> {
    try {
      const docSnapshot = await this.getDeliveriesForOrder(orderId)
        .withConverter(this.deliveryConverter)
        .orderBy("deliveryNumber", "desc")
        .get();

      if (!docSnapshot.empty) {
        const deliveries = docSnapshot.docs.map((doc) => doc.data());
        return deliveries;
      } else {
        console.log("No deliveries found for order ID:", orderId);
        return [];
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      return [];
    }
  }

  static async deliveryCounter(orderId: string): Promise<number> {
    try {
      const docSnapshot = await this.getDeliveriesForOrder(orderId)
        .withConverter(this.deliveryConverter)
        .get();

      if (!docSnapshot.empty) {
        return docSnapshot.docs.length;
      } else {
        console.log("0 deliveries found for order ID:", orderId);
        return 0;
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      return 0;
    }
  }
}
export default DeliveryService;
