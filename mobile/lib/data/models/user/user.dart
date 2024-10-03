import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';

class User {
  String? userId;
  String? username;
  String? email;
  TypeUser? typeUser;
  DateTime? joinDate;
  Role? role;
  String? photoURL;
  String? phoneNumber;
  String? firstName;
  String? lastName;
  String? description;
  String? mat;
  List<Map<String, dynamic>>? languages;
  List<Education>? educations;
  List<Certification>? certifications;
  List<Skill>? skills;
  Map<String, dynamic>? freelancerDetails;
  String? website;
  bool? isBeenFreelancer;

  User({
    this.userId,
    this.username,
    this.email,
    this.typeUser,
    this.joinDate,
    this.role,
    this.photoURL,
    this.phoneNumber,
    this.firstName = '',
    this.lastName = '',
    this.description,
    this.mat,
    this.languages,
    this.educations,
    this.certifications,
    this.skills,
    this.freelancerDetails,
    this.website,
    this.isBeenFreelancer,
  });

  // Convert JSON to User object
  factory User.fromJson(Map<String, dynamic> json) => User(
        userId: json['userId'],
        username: json['username'],
        email: json['email'],
        typeUser: json['typeUser'] != null
            ? TypeUser.values.firstWhere(
                (type) =>
                    type.toString().split('.').last.toUpperCase() ==
                    json['typeUser'].toString().toUpperCase(),
                orElse: () => TypeUser.user,
              )
            : null,
        joinDate: json['joinDate'] != null
            ? DateTime.fromMillisecondsSinceEpoch(
                json['joinDate']['_seconds'] * 1000)
            : null,
        role: json['role'] != null
            ? Role.values.firstWhere(
                (role) =>
                    role.toString().split('.').last.toUpperCase() ==
                    json['role'].toString().toUpperCase(),
                orElse: () => Role.client,
              )
            : null,
        photoURL: json['photoURL'],
        phoneNumber: json['phoneNumber'],
        firstName: json['firstName'],
        lastName: json['lastName'],
        description: json['description'],
        mat: json['mat'],
        languages: List<Map<String, dynamic>>.from(json['languages'] ?? []),
        educations: List<Education>.from(
            (json['educations'] ?? []).map((x) => Education.fromJson(x))),
        certifications: List<Certification>.from((json['certifications'] ?? [])
            .map((x) => Certification.fromJson(x))),
        skills: List<Skill>.from(
            (json['skills'] ?? []).map((x) => Skill.fromJson(x))),
        freelancerDetails: json['freelancerDetails'],
        website: json['website'],
        isBeenFreelancer: json['isBeenFreelancer'],
      );
}

class Education {
  String? educationId;
  String? diplomaUniversity;
  String? title;
  String? major;
  String? yearGrad;

  Education({
    this.educationId,
    this.diplomaUniversity,
    this.title,
    this.major,
    this.yearGrad,
  });

  // Convert JSON to Education object
  factory Education.fromJson(Map<String, dynamic> json) => Education(
        educationId: json['educationId'],
        diplomaUniversity: json['diplomaUniversity'],
        title: json['title'],
        major: json['major'],
        yearGrad: json['yearGrad'],
      );
}

class Certification {
  String? certificateId;
  String? title;
  String? major;
  String? yearObtain;

  Certification({
    this.certificateId,
    this.title,
    this.major,
    this.yearObtain,
  });

  // Convert JSON to Certification object
  factory Certification.fromJson(Map<String, dynamic> json) => Certification(
        certificateId: json['certificateId'],
        title: json['title'],
        major: json['major'],
        yearObtain: json['yearObtain'],
      );
}

class Skill {
  String? skillId;
  String? name;
  String? experience;
  String? title;
  String? major;
  String? yearGrad;

  Skill({
    this.skillId,
    this.name,
    this.experience,
    this.title,
    this.major,
    this.yearGrad,
  });

  // Convert JSON to Skill object
  factory Skill.fromJson(Map<String, dynamic> json) => Skill(
      skillId: json['skillId'],
      name: json['name'],
      experience: json['experience'] != null ? json['experience'] : null,
      title: json['title'],
      major: json['major'],
      yearGrad: json['yearGrad']);
}
