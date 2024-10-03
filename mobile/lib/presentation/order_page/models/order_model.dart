import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';

class Order {
  String? id;
  String? orderId;
  String? offerId;
  String? clientId;
  String? freelancerId;
  OrderStatus? status;
  double? adminFee;
  OrderPaymentStatus? paymentStatus;
  DateTime? createdDate;
  DateTime? acceptedAt;
  DateTime? deliveredAt;
  DateTime? completedAt;
  DateTime? cancelledAt;
  DateTime? expiration;
  String? deliveryDays;
  double? basePrice;
  double? totalPrice;
  String? plan;
  String? clientPhotoUrl;
  String? clientUserName;
  String? offerTitle;
  String? offerImage;
  List<String>? history;
  String? documentRef; // Nullable string

  Order({
    this.id,
    this.orderId,
    this.offerId,
    this.clientId,
    this.freelancerId,
    this.status,
    this.adminFee,
    this.paymentStatus,
    this.createdDate,
    this.acceptedAt,
    this.deliveredAt,
    this.completedAt,
    this.cancelledAt,
    this.expiration,
    this.deliveryDays,
    this.basePrice,
    this.totalPrice,
    this.plan,
    this.clientPhotoUrl,
    this.clientUserName,
    this.offerTitle,
    this.offerImage,
    this.history,
    this.documentRef,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      orderId: json['orderId'],
      offerId: json['offerId'],
      clientId: json['clientId'],
      freelancerId: json['freelancerId'],
      status: _parseOrderStatus(json['status']),
      adminFee: json['adminFee'].toDouble(),
      paymentStatus: _parseOrderPaymentStatus(json['paymentStatus']),
      createdDate: parseFirestoreTimestamp(json['createdDate']),
      acceptedAt: json['acceptedAt'] != null
          ? parseFirestoreTimestamp(json['acceptedAt'])
          : null,
      deliveredAt: json['deliveredAt'] != null
          ? parseFirestoreTimestamp(json['deliveredAt'])
          : null,
      completedAt: json['completedAt'] != null
          ? parseFirestoreTimestamp(json['completedAt'])
          : null,
      cancelledAt: json['cancelledAt'] != null
          ? parseFirestoreTimestamp(json['cancelledAt'])
          : null,
      expiration: parseFirestoreTimestamp(json['expiration']),
      deliveryDays: json['deliveryDays'],
      basePrice: json['basePrice'].toDouble(),
      totalPrice: json['totalPrice'].toDouble(),
      plan: json['plan'],
      clientPhotoUrl: json['clientPhotoUrl'],
      clientUserName: json['clientUserName'],
      offerTitle: json['offerTitle'],
      offerImage: json['offerImage'],
      history: List<String>.from(json['history']),
      documentRef: json['documentRef'],
    );
  }

  // Map<String, dynamic> toJson() {
  //   return {
  //     'id': id,
  //     'orderId': orderId,
  //     'offerId': offerId,
  //     'clientId': clientId,
  //     'freelancerId': freelancerId,
  //     'status': status.toString().split('.').last,
  //     'adminFee': adminFee,
  //     'paymentStatus': paymentStatus.toString().split('.').last,
  //     'createdDate': createdDate.toIso8601String(),
  //     'acceptedAt': acceptedAt?.toIso8601String(),
  //     'deliveredAt': deliveredAt?.toIso8601String(),
  //     'completedAt': completedAt?.toIso8601String(),
  //     'cancelledAt': cancelledAt?.toIso8601String(),
  //     'expiration': expiration.toIso8601String(),
  //     'deliveryDays': deliveryDays,
  //     'basePrice': basePrice,
  //     'totalPrice': totalPrice,
  //     'plan': plan,
  //     'history': history,
  //     'documentRef': documentRef,
  //   };
  // }

  static OrderPaymentStatus _parseOrderPaymentStatus(String value) {
    return OrderPaymentStatus.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == value.toLowerCase(),
    );
  }

  static OrderStatus _parseOrderStatus(String value) {
    return OrderStatus.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == value.toLowerCase(),
    );
  }
}
