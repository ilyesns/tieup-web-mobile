import { firestore } from "../config/firebase.config";
import { ExperienceLevel } from "../utilities/enums";
import generateRandomString from "../utilities/generate_string_function";
import {Freelancer} from "./freelancer";
import { DynamicObject, dateToFirestore, mapToFirestore, withoutNulls } from "./utilities/util";

class Skill {
     skillId: string;
     label: string;
     levelExp: ExperienceLevel;
     title: string;
     major: string;
     yearGrad: Date;
  
    constructor(skillId: string, label: string, levelExp: ExperienceLevel, title: string, major: string, yearGrad: Date) {
      this.skillId = skillId;
      this.label = label;
      this.levelExp = levelExp;
      this.title = title;
      this.major = major;
      this.yearGrad = yearGrad;
    }
    toFirestore(): firestore.DocumentData {
      return withoutNulls({
        skillId: this.skillId,
        label: this.label,
        levelExp: this.levelExp,
        title: this.title,
        major: this.major,
        yearGrad:dateToFirestore(this.yearGrad)
      });
    }
   static fromFirestore(data: DynamicObject) {
      return new Skill(
        data.skillId,
        data.label,
        data.levelExp,
         data.title,
       data.major,
       data.yearGrad
      );
    }
  }

  
  
  export default Skill;