import Education from "../models/education";
import {Freelancer} from "../models/freelancer";
import { DynamicObject, mapToFirestore } from "../models/utilities/util";
import generateRandomString from "../utilities/generate_string_function";

class EducationService {

    
  static async  addEducation(freelancer: Freelancer, educationData : DynamicObject):Promise<boolean> {

    const newEducation = new Education(
       generateRandomString(),
        educationData.diplomaUniversity,
        educationData.title,
        educationData.major,
        educationData.yearGrad
      );
  
      let educations =  freelancer.educations;

      educations?.push(newEducation);
      let freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));
      freelancerDetails?.set('educations',mapToFirestore(educations));

      let freelancerData = mapToFirestore(freelancerDetails);
      console.log(freelancerData)
      
      try{
        if(freelancer.documentId)
       await freelancer.documentId.update('freelancerDetails',freelancerData);
        return true;
      }catch(e){
         console.log(e);
         return false;
      }
        
    

    }
  
    static async  updateEducation(freelancer: Freelancer, educationData : DynamicObject):Promise<boolean> {

        const updatedEducation = new Education(
            educationData.educationId,
            educationData.diplomaUniversity,
            educationData.title,
            educationData.major,
            educationData.yearGrad
          );
      
          let educations =  freelancer.educations;
         const updatedEducations =  educations?.filter((e)=> e.educationId != educationData.educationId)
         updatedEducations?.push(updatedEducation);
         const freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));
         freelancerDetails?.set('educations',mapToFirestore(updatedEducations));

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
  
        static async  deleteEducation(freelancer: Freelancer, educationId : string):Promise<boolean> {

            let educations =  freelancer.educations?.filter((e)=>e.educationId != educationId);
            const freelancerDetails = new Map<string, any>(Object.entries(freelancer.freelancerDetails!));
            freelancerDetails?.set('educations',mapToFirestore(educations));
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

export default EducationService;