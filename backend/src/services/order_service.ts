import { DocumentReference } from "firebase-admin/firestore";
import { OrderPaymentStatus, OrderStatus } from "../utilities/enums";
import Order from "../models/order";
import admin, { firestore } from "../config/firebase.config";
import { withoutNulls } from "../models/utilities/util";
import { orderBy } from "firebase/firestore";
import AlgoliaManager from "../utilities/search_algolia/algolia_manager";

const db = admin.firestore();

export default class OrderService {
  static collection = db.collection("orders");

  static orderConverter: firestore.FirestoreDataConverter<Order> = {
    toFirestore(order: Order): firestore.DocumentData {
      return withoutNulls({
        id: order.id,
        orderId: order.orderId,
        offerId: order.offerId,
        clientId: order.clientId,
        freelancerId: order.freelancerId,
        status: order.status,
        createdDate: order.createdDate,
        deliveredAt: order.deliveredAt,
        acceptedAt: order.acceptedAt,
        completedAt: order.completedAt,
        cancelledAt: order.cancelledAt,
        paymentStatus: order.paymentStatus,
        adminFee: order.adminFee,
        basePrice: order.basePrice,
        totalPrice: order.totalPrice,
        expiration: order.expiration,
        history: order.history,
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Order {
      const data = snapshot.data();
      return new Order({
        id: data.id,
        orderId: data.orderId,
        offerId: data.offerId,
        clientId: data.clientId,
        freelancerId: data.freelancerId,
        status: data.status,
        paymentStatus: data.paymentStatus as OrderPaymentStatus,
        createdDate: data.createdDate,
        deliveredAt: data.deliveredAt,
        adminFee: data.adminFee,
        acceptedAt: data.acceptedAt,
        completedAt: data.completedAt,
        cancelledAt: data.cancelledAt,
        basePrice: data.basePrice,
        totalPrice: data.totalPrice,
        expiration: data.expiration,
        plan: data.plan,
        history: data.history,
        documentRef: snapshot.ref,
      });
    },
  };
  static async createOrder(orderData: {
    orderId: string;
    plan: string;
    offerId: DocumentReference;
    clientId: DocumentReference;
    freelancerId: DocumentReference;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    createdDate: Date;
    expiration: Date;
    adminFee: number;
    basePrice: number;
    totalPrice: number;
    history?: string[];
  }): Promise<DocumentReference | null> {
    const orderId = this.collection.withConverter(this.orderConverter).doc();
    const newOrder = new Order({
      id: orderId.id,
      orderId: orderData.orderId,
      offerId: orderData.offerId,
      expiration: orderData.expiration,
      clientId: orderData.clientId,
      freelancerId: orderData.freelancerId,
      paymentStatus: orderData.paymentStatus,
      status: orderData.status,
      plan: orderData.plan,
      createdDate: orderData.createdDate,
      adminFee: orderData.adminFee,
      basePrice: orderData.basePrice,
      totalPrice: orderData.totalPrice,
      history: orderData.history! || [],
      documentRef: orderId,
    });

    await orderId.set(newOrder);
    return orderId;
  }

  static async updateOrderStatus(order: Order, newStatus: OrderStatus) {
    let dateField =
      newStatus === OrderStatus.Delivered
        ? "deliveredAt"
        : newStatus === OrderStatus.Completed
        ? "completedAt"
        : newStatus === OrderStatus.Cancelled
        ? "cancelledAt"
        : newStatus === OrderStatus.InProgress
        ? "acceptedAt"
        : null; // Ensure a valid date field is selected

    // Ensure dateField is valid before proceeding with the update
    if (dateField) {
      const updateData: any = { status: newStatus };
      updateData[dateField] = new Date();

      try {
        await order.documentRef!.update(updateData);
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    } else {
      console.error("Invalid status:", newStatus);
    }
  }
  static async updateAdminFee(order: Order, fee: number) {
    let updateData = {
      adminFee: order.adminFee + fee,
    };

    try {
      await order.documentRef!.update(updateData);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.orderConverter)
        .doc(orderId)
        .get();
      const orderData = docSnapshot.data();
      if (docSnapshot.exists && orderData) {
        // Explicitly cast the data to Portfolio to satisfy TypeScript's type checking
        return orderData as Order;
      } else {
        console.log("No such Order found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching  order", error);
      return null;
    }
  }

  static async getOrderByUserID(
    userId: DocumentReference,
    field: string
  ): Promise<Order | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.orderConverter)
        .where(field, "==", userId)
        .limit(1)
        .get();
      if (!docSnapshot.empty) {
        const orderData = docSnapshot.docs.map((e) => e.data())[0];
        return orderData as Order;
      } else {
        console.log("No such Order found by user id!");
        return null;
      }
    } catch (error) {
      console.error("No such Order found by user id", error);
      return null;
    }
  }
  static async getAllOrdersByUserID(
    userId: DocumentReference,
    field: string
  ): Promise<Order[] | []> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.orderConverter)
        .where(field, "==", userId)
        .where("paymentStatus", "==", OrderPaymentStatus.PAID)
        .get();
      if (!docSnapshot.empty) {
        const ordersData = docSnapshot.docs.map((e) => e.data());
        return ordersData as Order[];
      } else {
        console.log("No such Orders found by user id!");
        return [];
      }
    } catch (error) {
      console.error("No such Orders found by user id", error);
      return [];
    }
  }
  static async getAllOrders(
    pageNum: number,
    size: number
  ): Promise<{ orders: Order[]; totalCount: number }> {
    try {
      const ordersRef = this.collection
        .withConverter(this.orderConverter)
        .where("paymentStatus", "==", OrderPaymentStatus.PAID);

      // Fetch total count of users
      const totalCountSnapshot = await ordersRef.get();
      const totalCount = totalCountSnapshot.size;

      // Fetch users for the current page
      const docSnapshot = await ordersRef
        .orderBy("createdDate", "desc")
        .limit(size)
        .offset(pageNum * size)
        .get();
      if (!docSnapshot.empty) {
        const ordersData = docSnapshot.docs.map((doc) => doc.data());
        return { orders: ordersData as Order[], totalCount };
      } else {
        console.log("No users found!");
        return { orders: [], totalCount };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return { orders: [], totalCount: 0 };
    }
  }

  static async setHistoryOrder(
    order: Order,
    newHistory: string
  ): Promise<void> {
    const historyOrd = order.history ?? [];
    historyOrd.push(newHistory);
    await order!.documentRef?.update({ history: historyOrd });
  }

  static async viewHistoryOrder(orderId: string): Promise<string[] | null> {
    return (await this.getOrder(orderId))?.history || null;
  }
  static async search(term: string): Promise<Order[] | []> {
    const orders = await AlgoliaManager.getInstance().algoliaQuery({
      index: "orders",
      term: term,
      orderPaymentStatus: OrderPaymentStatus.PAID,
      useCache: true,
    });

    return orders;
  }
}
