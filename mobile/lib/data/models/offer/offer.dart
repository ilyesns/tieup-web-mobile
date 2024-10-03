import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/data/models/user/user.dart';
import 'package:Tieup/presentation/dashboard_page/model/freelancer_profile.dart';

class ExtraDataOffer {
  User? user;
  FreelancerProfileStatistics? freelancerProfile;

  ExtraDataOffer({this.user, this.freelancerProfile});
  factory ExtraDataOffer.fromJson(Map<String, dynamic> json) => ExtraDataOffer(
      user: User.fromJson(json['user']),
      freelancerProfile:
          FreelancerProfileStatistics.fromJson(json['levelUser']));
}

class Offer {
  String? offerId;
  String? freelancerId;
  String? title;
  String? description;
  String? serviceName;
  String? serviceId;
  String? subServiceName;
  String? subServiceId;
  Plan? basicPlan;
  Plan? premiumPlan;
  OfferStatus? status;
  String? documentRef;
  Gallery? gallery;
  DateTime? createdAt;
  ExtraDataOffer? extraData;

  Offer({
    this.offerId,
    this.freelancerId,
    this.title,
    this.description,
    this.serviceName,
    this.serviceId,
    this.subServiceName,
    this.subServiceId,
    this.basicPlan,
    this.premiumPlan,
    this.status,
    this.documentRef,
    this.gallery,
    this.extraData,
    this.createdAt,
  });

  factory Offer.fromJson(Map<String, dynamic> json) {
    return Offer(
        offerId: json['offer']['offerId'],
        freelancerId: json['offer']['freelancerId'],
        title: json['offer']['title'],
        description: json['offer']['description'],
        serviceName: json['offer']['serviceName'],
        serviceId: json['offer']['serviceId'],
        subServiceName: json['offer']['subServiceName'],
        subServiceId: json['offer']['subServiceId'],
        basicPlan: json['offer']['basicPlan'] != null
            ? Plan.fromJson(json['offer']['basicPlan'])
            : null,
        premiumPlan: json['offer']['premiumPlan'] != null
            ? Plan.fromJson(json['offer']['premiumPlan'])
            : null,
        status: json['offer']['status'] != null
            ? OfferStatus.values.firstWhere(
                (e) => e.toString() == 'OfferStatus.${json['offer']['status']}')
            : null,
        gallery: json['offer']['gallery'] != null
            ? Gallery.fromJson(json['offer']['gallery'])
            : null,
        // createdAt:
        //     json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
        extraData: ExtraDataOffer.fromJson(json));
  }
}

class Plan {
  String? planType;
  String? title;
  String? description;
  double? price;
  int? revisionNumber;
  String? deliveryTime;

  Plan({
    this.planType,
    this.title,
    this.description,
    this.price,
    this.revisionNumber,
    this.deliveryTime,
  });

  factory Plan.fromJson(Map<String, dynamic> json) {
    return Plan(
      planType: json['planType'],
      title: json['title'],
      description: json['description'],
      price: json['price'] != null ? double.parse(json['price']) : null,
      revisionNumber: json['revisionNumber'] != null
          ? int.parse(json['revisionNumber'])
          : null,
      deliveryTime: json['deliveryTime'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'planType': planType,
      'title': title,
      'description': description,
      'price': price,
      'revisionNumber': revisionNumber,
      'deliveryTime': deliveryTime,
    };
  }
}

class Gallery {
  final List<GalleryItem> images;
  final GalleryItem? video;
  final GalleryItem? document;

  Gallery({
    required this.images,
    this.video,
    this.document,
  });

  factory Gallery.fromJson(Map<String, dynamic> json) {
    List<dynamic> jsonImages = json['images'] ?? [];
    List<GalleryItem> images =
        jsonImages.map((image) => GalleryItem.fromJson(image)).toList();

    return Gallery(
      images: images,
      video: json['video'] != null ? GalleryItem.fromJson(json['video']) : null,
      document: json['document'] != null
          ? GalleryItem.fromJson(json['document'])
          : null,
    );
  }
}

class GalleryItem {
  final int size;
  final String name;
  final String type;
  final String url;

  GalleryItem({
    required this.size,
    required this.name,
    required this.type,
    required this.url,
  });

  factory GalleryItem.fromJson(Map<String, dynamic> json) {
    return GalleryItem(
      size: json['size'],
      name: json['name'],
      type: json['type'],
      url: json['url'],
    );
  }
}
