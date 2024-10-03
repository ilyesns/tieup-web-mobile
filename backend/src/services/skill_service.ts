import {Freelancer} from "../models/freelancer";
import Skill from "../models/skills";
import { DynamicObject, mapToFirestore } from "../models/utilities/util";
import generateRandomString from "../utilities/generate_string_function";


class SkillService {
    static async  addSkill(freelancer: Freelancer, skillData : DynamicObject):Promise<boolean> {

        const newSkill= new Skill(
           generateRandomString(),
            skillData.label,
            skillData.levelExp,
            skillData.title,
            skillData.major,
            skillData.yearGrad
          );
      
          let skills =  freelancer.skills;
          skills?.push(newSkill);
          const freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));

          freelancerDetails?.set('skills',mapToFirestore(skills));

          let freelancerData = mapToFirestore(freelancerDetails);
           
          try{
            if(freelancer.documentId)
            await freelancer.documentId.update('freelancerDetails',freelancerData);
            return true;
          }catch(e){
             console.log(e);
             return false;
          }

        }
        
        static async  updateSkill(freelancer: Freelancer, skillData : DynamicObject):Promise<boolean> {
            const updatedSkill= new Skill(
                 skillData.skillId,
                 skillData.label,
                 skillData.levelExp,
                 skillData.title,
                 skillData.major,
                 skillData.yearGrad
               );
           
               let skills =  freelancer.skills;
               let updatedSkills =  skills?.filter((e)=> e.skillId != skillData.skillId)
               updatedSkills?.push(updatedSkill);
               let freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));
    
               freelancerDetails?.set('skills',mapToFirestore(updatedSkills));
     
               const freelancerData = mapToFirestore(freelancerDetails);
               try{
                if(freelancer.documentId)
                 await freelancer.documentId.update('freelancerDetails',freelancerData);
                 return true;
               }catch(e){
                  console.log(e);
                  return false;
               }
                 
    
        }
        
    static async  deleteSkill(freelancer: Freelancer, skillId : string):Promise<boolean> {
        
        let skills =  freelancer.skills?.filter((e)=>e.skillId != skillId);
        let freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));
           freelancerDetails?.set('skills',mapToFirestore(skills));
           const freelancerData = mapToFirestore(freelancerDetails);

      try{
        if(freelancer.documentId)
        await freelancer.documentId.update('freelancerDetails',freelancerData);
        return true;
      }catch(e){
         console.log(e);
         return false;
      }
        
    }  
}

export default SkillService;
