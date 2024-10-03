import { firestore } from "../config/firebase.config";
import generateRandomString from "../utilities/generate_string_function";
import { Freelancer } from "./freelancer";
import {
  DynamicObject,
  dateToFirestore,
  mapToFirestore,
  withoutNulls,
} from "./utilities/util";

class Certification {
  certificateId: string;
  title: string;
  major: string;
  yearObtain: Date;

  constructor(
    certificateId: string,
    title: string,
    major: string,
    yearObtain: Date
  ) {
    this.certificateId = certificateId;
    this.title = title;
    this.major = major;
    this.yearObtain = yearObtain;
  }
  toFirestore(): firestore.DocumentData {
    return withoutNulls({
      certificateId: this.certificateId,
      title: this.title,
      major: this.major,
      yearObtain: dateToFirestore(this.yearObtain),
    });
  }
  static fromFirestore(data: DynamicObject) {
    return new Certification(
      data.certificateId,
      data.title,
      data.major,
      data.yearObtain
    );
  }
}

export default Certification;
