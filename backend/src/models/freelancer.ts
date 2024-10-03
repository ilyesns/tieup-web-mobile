import { DocumentReference } from "firebase-admin/firestore";
import Client from "./client";
import Education from "./education";
import Certification from "./certification";
import Skill from "./skills";
import { Role, TypeUser } from "../utilities/enums";
import { firestore } from "../config/firebase.config";
import { isEmptyResult, withoutNulls } from "./utilities/util";

interface FreelancerData {
  userId?: string;
  username?: string;
  email?: string;
  typeUser?: TypeUser;
  joinDate?: Date;
  role?: Role;
  documentId?: DocumentReference;
  photoURL?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  mat?: string;
  languages?: Map<string, string>[];
  educations?: Education[];
  certifications?: Certification[];
  skills?: Skill[];
  freelancerDetails?: Map<string, any>;
  website?: string;
  isBeenFreelancer?: boolean;
}
class Freelancer extends Client {
  description?: string;
  website?: string;
  mat?: string;
  languages?: Map<string, string>[];
  educations?: Education[];
  certifications?: Certification[];
  skills?: Skill[];
  freelancerDetails?: Map<string, any>;
  isBeenFreelancer?: boolean;

  constructor({
    userId,
    username,
    email,
    typeUser,
    joinDate,
    role,
    documentId,
    photoURL,
    firstName,
    lastName,
    phoneNumber,
    description,
    languages,
    educations,
    certifications,
    skills,
    freelancerDetails,
    mat,
    isBeenFreelancer,
    website,
  }: {
    userId?: string;
    username?: string;
    email?: string;
    typeUser?: TypeUser;
    joinDate?: Date;
    role?: Role;
    documentId?: DocumentReference;
    photoURL?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    languages?: Map<string, string>[];
    educations?: Education[];
    certifications?: Certification[];
    skills?: Skill[];
    freelancerDetails?: Map<string, any>;
    mat?: string;
    website?: string;
    isBeenFreelancer?: boolean;
  }) {
    super({
      userId,
      username,
      email,
      typeUser,
      joinDate,
      photoURL,
      phoneNumber,
      documentId,
      role,
      firstName,
      lastName,
    });
    this.description = description;
    this.languages = languages;
    this.educations = educations;
    this.certifications = certifications;
    this.skills = skills;
    this.mat = mat;
    this.website = website;
    this.isBeenFreelancer = isBeenFreelancer;
    this.freelancerDetails = freelancerDetails;
  }
  toFirestoreObject(): firestore.DocumentData {
    const freelancerDetails = withoutNulls({
      mat: this.mat,
      website: this.website,
      description: this.description,
      languages: this.languages,
      educations: this.educations?.map((e) => e.toFirestore()),
      certifications: this.certifications?.map((e) => e.toFirestore()),
      skills: this.skills?.map((e) => e.toFirestore()),
    }) as Map<string, any>;
    console.log(freelancerDetails);
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      typeUser: this.typeUser,
      joinDate: this.joinDate,
      role: this.role,
      documentId: this.documentId,
      photoURL: this.photoURL,
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      mat: this.mat,
      isBeenFreelancer: this.isBeenFreelancer,

      freelancerDetails: isEmptyResult(freelancerDetails)
        ? null
        : freelancerDetails,
    };
  }
}

export { Freelancer, FreelancerData };
