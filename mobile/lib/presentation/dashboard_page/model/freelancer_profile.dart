import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:Tieup/core/utils/date_time_utils.dart';

class FreelancerProfileStatistics {
  String freelancerId;
  String? sellerLevel;
  DateTime? nextEvaluationDate;
  int? responseTime;
  int? orderCompletionRate;
  int? onTimeDeliveryRate;
  int? positiveRatingPercentage;
  String? documentRef;

  FreelancerProfileStatistics({
    required this.freelancerId,
    this.sellerLevel,
    this.nextEvaluationDate,
    this.responseTime,
    this.orderCompletionRate,
    this.onTimeDeliveryRate,
    this.positiveRatingPercentage,
    this.documentRef,
  });

  factory FreelancerProfileStatistics.fromJson(Map<String, dynamic> json) {
    return FreelancerProfileStatistics(
      freelancerId: json['freelancerId'] as String,
      sellerLevel: json['sellerLevel'] as String?,
      nextEvaluationDate: parseFirestoreTimestamp(json['nextEvaluationDate']),
      responseTime: json['responseTime'],
      orderCompletionRate: json['orderCompletionRate'],
      onTimeDeliveryRate: json['onTimeDeliveryRate'],
      positiveRatingPercentage: json['positiveRatingPercentage'],
      documentRef: json['documentRef'] as String?,
    );
  }
}
