import { DocumentReference } from "firebase-admin/firestore";
import { DynamicObject, dateToFirestore, mapToFirestore, mapToFirestoreT2, withoutNulls } from "./utilities/util";
import {Freelancer} from "./freelancer";
import { Request, Response } from 'express';
import generateRandomString from "../utilities/generate_string_function";
import { firestore } from "../config/firebase.config";

class Education {
    educationId: string;
    diplomaUniversity: string;
    title: string;
    major: string;
    yearGrad: Date;
  
    constructor(
      educationId: string,
      diplomaUniversity: string,
      title: string,
      major: string,
      yearGrad: Date
    ) {
      this.educationId = educationId;
      this.diplomaUniversity = diplomaUniversity;
      this.title = title;
      this.major = major;
      this.yearGrad = yearGrad;
    }
  
    
    toFirestore(): firestore.DocumentData {
      return withoutNulls({
        educationId: this.educationId,
        diplomaUniversity: this.diplomaUniversity,
        title: this.title,
        major: this.major,
        yearGrad:dateToFirestore(this.yearGrad)
      });
    }
   static fromFirestore(data: DynamicObject) {
      return new Education(
        data.educationId,
        data.diplomaUniversity,
       data.title,
       data.major,
       data.yearGrad
      );
    }
  }
  
  export default Education;