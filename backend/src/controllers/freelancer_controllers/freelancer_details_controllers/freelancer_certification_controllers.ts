import { DynamicObject } from "../../../models/utilities/util";
import CertificationService from "../../../services/certification_service";
import EducationService from "../../../services/education_service";
import FreelancerService from "../../../services/freelancer_service";
import SkillService from "../../../services/skill_service";

export default class FreelancerCertificationController{
    
    static  async createCertification(data:DynamicObject): Promise<void> {
        const {freelancerId,certifData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await CertificationService.addCertification(freelancer!,certifData)

    }
    static  async updateCertification(data:DynamicObject): Promise<void> {
        const {freelancerId,certifData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await CertificationService.updateCertification(freelancer!,certifData)

    }
    static  async deleteCertification(data:DynamicObject): Promise<void> {
        const {freelancerId,certifId} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await CertificationService.deleteCertification(freelancer!,certifId)

    }

    


    
}
