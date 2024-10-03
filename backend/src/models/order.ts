import { DocumentReference } from "firebase-admin/firestore";
import { OrderPaymentStatus, OrderStatus } from "../utilities/enums";

export default class Order {
  id: string;
  orderId: string;
  offerId: DocumentReference;
  clientId: DocumentReference;
  freelancerId: DocumentReference;
  status: OrderStatus;
  adminFee: number;
  paymentStatus: OrderPaymentStatus;
  createdDate: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  expiration: Date;
  deliveryDays?: string;
  basePrice: number;
  totalPrice: number;
  plan: string;
  history: string[];
  documentRef?: DocumentReference;

  constructor({
    id,
    orderId,
    offerId,
    clientId,
    freelancerId,
    adminFee,
    status,
    createdDate,
    deliveredAt,
    completedAt,
    acceptedAt,
    cancelledAt,
    basePrice,
    totalPrice,
    history,
    expiration,
    paymentStatus,
    documentRef,
    deliveryDays,
    plan,
  }: {
    id: string;
    orderId: string;
    offerId: DocumentReference;
    clientId: DocumentReference;
    freelancerId: DocumentReference;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    createdDate: Date;
    deliveredAt?: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    deliveryDays?: string;
    expiration: Date;
    adminFee: number;
    basePrice: number;
    totalPrice: number;
    history: string[];
    plan: string;
    documentRef?: DocumentReference;
  }) {
    this.id = id;
    this.orderId = orderId;
    this.offerId = offerId;
    this.clientId = clientId;
    this.freelancerId = freelancerId;
    this.status = status;
    this.createdDate = createdDate;
    this.deliveredAt = deliveredAt;
    this.acceptedAt = acceptedAt;
    this.completedAt = completedAt;
    this.cancelledAt = cancelledAt;
    this.adminFee = adminFee;
    this.basePrice = basePrice;
    this.totalPrice = totalPrice;
    this.plan = plan;
    this.history = history;
    this.deliveryDays = deliveryDays;
    this.expiration = expiration;
    this.paymentStatus = paymentStatus;
    this.documentRef = documentRef;
  }
}
