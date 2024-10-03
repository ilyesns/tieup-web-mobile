import { Freelancer, FreelancerData } from "../models/freelancer";
import { DocumentReference } from "firebase-admin/firestore";
import {
  DynamicObject,
  dateToFirestore,
  mapFromFirestore,
  mapToFirestore,
  withoutNulls,
} from "../models/utilities/util";
import Skill from "../models/skills";
import Education from "../models/education";
import Certification from "../models/certification";
import admin, { firestore } from "../config/firebase.config";
import ClientService from "./client_service";
import { Role } from "../utilities/enums";

const db = admin.firestore();

class FreelancerService extends ClientService {
  static collection = db.collection("users");

  static freelancerConverter: firestore.FirestoreDataConverter<Freelancer> = {
    toFirestore(freelancer: Freelancer): firestore.DocumentData {
      return withoutNulls({
        userId: freelancer.userId,
        username: freelancer.username,
        email: freelancer.email,
        phoneNumber: freelancer.phoneNumber,
        photoURL: freelancer.photoURL,
        typeUser: freelancer.typeUser,
        joinDate: dateToFirestore(freelancer!.joinDate!),
        firstName: freelancer.firstName,
        lastName: freelancer.lastName,
        isBeenFreelancer: freelancer.isBeenFreelancer,

        freelancerDetails: {
          description: freelancer.description,
          languages: freelancer.languages,
          educations: freelancer.educations,
          certifications: freelancer.certifications,
          mat: freelancer.mat,
          website: freelancer.website,
          skills: freelancer.skills,
        },
      });
    },
    fromFirestore: function (
      snapshot: firestore.QueryDocumentSnapshot<
        firestore.DocumentData,
        firestore.DocumentData
      >
    ): Freelancer {
      const data = snapshot.data();
      return new Freelancer({
        userId: snapshot.id!,
        username: data.username,
        email: data.email,
        typeUser: data.typeUser,
        joinDate: data.joinDate || null,
        role: data.role,
        documentId: snapshot.ref,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        mat: data.freelancerDetails?.mat,
        website: data.freelancerDetails?.website,
        isBeenFreelancer: data.isBeenFreelancer,

        languages:
          data.freelancerDetails != null
            ? data.freelancerDetails.languages
            : null,
        educations:
          data.freelancerDetails != null
            ? data.freelancerDetails.educations
            : [],
        skills:
          data.freelancerDetails != null ? data.freelancerDetails.skills : [],
        certifications:
          data.freelancerDetails != null
            ? data.freelancerDetails.certifications
            : [],
        description:
          data.freelancerDetails != null
            ? data.freelancerDetails.description
            : null,
        freelancerDetails: data.freelancerDetails,
      });
    },
  };

  static async createFreelancerDetainsField(
    userId: DocumentReference,
    data: DynamicObject
  ): Promise<boolean> {
    const freelancerDetails = this.createFreelancerPartRecordData(data);

    try {
      userId
        .withConverter(this.freelancerConverter)
        .update(
          "freelancerDetails",
          freelancerDetails,
          "isBeenFreelancer",
          true,
          "role",
          Role.Freelancer
        );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  static async getFreelancer(freelancerId: string): Promise<Freelancer | null> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.freelancerConverter)
        .doc(freelancerId)
        .get();
      const freelancerData = docSnapshot.data();
      if (docSnapshot.exists && freelancerData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return freelancerData as Freelancer;
      } else {
        console.log("No such Freelancer found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Freelancer:", error);
      return null;
    }
  }
  static async getFreelancerDetails(freelancerId: string): Promise<any | []> {
    try {
      const docSnapshot = await this.collection
        .withConverter(this.freelancerConverter)
        .doc(freelancerId)
        .get();
      const freelancerDetailsData = docSnapshot.data()?.freelancerDetails;
      if (docSnapshot.exists && freelancerDetailsData) {
        // Explicitly cast the data to Chat to satisfy TypeScript's type checking
        return freelancerDetailsData;
      } else {
        console.log("No such Freelancer found!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching Freelancer:", error);
      return [];
    }
  }
  static async updateFreelancer(
    data: FreelancerData,
    userId: string
  ): Promise<void> {
    const freelancer = await this.getFreelancer(userId);
    console.log(userId);

    try {
      const updatedData = withoutNulls(
        new Freelancer({ ...data }).toFirestoreObject()
      );
      console.log(updatedData);
      if (freelancer?.documentId) {
        await freelancer?.documentId
          .withConverter(this.freelancerConverter)
          .update(updatedData);
      }
    } catch (e) {
      console.log(e);
    }
  }
  static async updateFreelancerField(
    data: FreelancerData,
    userId: string
  ): Promise<void> {
    try {
      const freelancer = await FreelancerService.getFreelancer(userId);

      if (freelancer) {
        const updatedFreelancerData = {
          freelancerDetails: {
            ...freelancer?.freelancerDetails!,
            ...data,
          },
        };

        const updatedData = this.createFreelancerPartRecordData(
          updatedFreelancerData!.freelancerDetails!
        );

        console.log(updatedData);
        freelancer.documentId?.update("freelancerDetails", updatedData);
      }
    } catch (error) {
      console.error("Error updating freelancer field:", error);
      throw error;
    }
  }

  static createFreelancerPartRecordData({
    description,
    skills,
    educations,
    certifications,
    languages,
    mat,
    website,
  }: {
    website?: string;
    mat?: string;
    description?: string;
    skills?: Skill[];
    educations?: Education[];
    certifications?: Certification[];
    languages?: Map<string, string>[];
  }): any {
    const firestoreData = withoutNulls({
      description: description,
      skills: skills,
      mat: mat,
      website: website,
      educations: educations,
      certifications: certifications,
      languages: languages,
    });
    return firestoreData;
  }
}

export default FreelancerService;
