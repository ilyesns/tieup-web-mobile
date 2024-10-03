import Certification from "../models/certification";
import { Freelancer } from "../models/freelancer";
import { DynamicObject, mapToFirestore } from "../models/utilities/util";
import generateRandomString from "../utilities/generate_string_function";

class CertificationService {
  static async addCertification(
    freelancer: Freelancer,
    certificationData: DynamicObject
  ): Promise<boolean> {
    const newCertification = new Certification(
      generateRandomString(),
      certificationData.certificateFrom,
      certificationData.title,
      certificationData.major
    );

    let certifications = freelancer.certifications;
    certifications?.push(newCertification);
    const freelancerDetails = new Map<string, any>(
      Object.entries(freelancer.freelancerDetails!)
    );

    freelancerDetails?.set("certifications", mapToFirestore(certifications));

    const freelancerData = mapToFirestore(freelancerDetails);

    try {
      if (freelancer?.documentId)
        await freelancer?.documentId.update(
          "freelancerDetails",
          freelancerData
        );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async updateCertification(
    freelancer: Freelancer,
    certificationData: DynamicObject
  ): Promise<boolean> {
    const updatedCertification = new Certification(
      certificationData.certificateId,
      certificationData.certificateFrom,
      certificationData.title,
      certificationData.major
    );

    let updatedCertifications = freelancer.certifications?.filter(
      (e) => e.certificateId != certificationData.certificateId
    );
    updatedCertifications?.push(updatedCertification);

    const freelancerDetails = new Map<string, any>(
      Object.entries(freelancer.freelancerDetails!)
    );

    freelancerDetails?.set(
      "certifications",
      mapToFirestore(updatedCertifications)
    );

    const freelancerData = mapToFirestore(freelancerDetails);

    try {
      if (freelancer?.documentId)
        await freelancer.documentId.update("freelancerDetails", freelancerData);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async deleteCertification(
    freelancer: Freelancer,
    certificateId: string
  ): Promise<boolean> {
    let certifications = freelancer.certifications?.filter(
      (e) => e.certificateId != certificateId
    );
    const freelancerDetails = new Map<string, any>(
      Object.entries(freelancer.freelancerDetails!)
    );

    freelancerDetails?.set("certifications", mapToFirestore(certifications));

    const freelancerData = mapToFirestore(freelancerDetails);

    try {
      if (freelancer?.documentId)
        await freelancer.documentId.update("freelancerDetails", freelancerData);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default CertificationService;
