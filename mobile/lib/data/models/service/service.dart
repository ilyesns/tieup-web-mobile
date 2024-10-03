class Service {
  String? serviceId;
  String? name;
  String? description;
  String? topic;
  String? image;
  List<String>? subServices;
  String? parentServiceId;
  bool? isRoot;
  DateTime? createdAt;
  String? createdBy;
  String? documentRef;

  Service({
    this.serviceId,
    this.name,
    this.description,
    this.topic,
    this.image,
    this.subServices,
    this.parentServiceId,
    this.isRoot,
    this.createdAt,
    this.createdBy,
    this.documentRef,
  });

  // Convert JSON to Service object
  factory Service.fromJson(Map<String, dynamic> json) => Service(
        serviceId: json['serviceId'],
        name: json['name'],
        description: json['description'],
        topic: json['topic'],
        image: json['image'],
        subServices: json['subServices'] != null
            ? List<String>.from(json['subServices'])
            : null,
        parentServiceId: json['parentServiceId'],
        isRoot: json['isRoot'],
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'])
            : null,
        createdBy: json['createdBy'],
        documentRef: json['documentRef'],
      );

  // Convert Service object to JSON
  Map<String, dynamic> toJson() => {
        'serviceId': serviceId,
        'name': name,
        'description': description,
        'topic': topic,
        'image': image,
        'subServices': subServices,
        'parentServiceId': parentServiceId,
        'isRoot': isRoot,
        'createdAt': createdAt != null ? createdAt!.toIso8601String() : null,
        'createdBy': createdBy,
        'documentRef': documentRef,
      };
}
