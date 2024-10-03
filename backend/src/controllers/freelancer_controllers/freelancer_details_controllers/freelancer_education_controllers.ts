import { DynamicObject } from "../../../models/utilities/util";
import EducationService from "../../../services/education_service";
import FreelancerService from "../../../services/freelancer_service";

export default class FreelancerEducationController{
    
    static  async createEducation(data:DynamicObject): Promise<void> {
        const {freelancerId,educationData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await EducationService.addEducation(freelancer!,educationData)

    }
    static  async updateEducation(data:DynamicObject): Promise<void> {
        const {freelancerId,educationData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await EducationService.updateEducation(freelancer!,educationData)

    }
    static  async deleteEducation(data:DynamicObject): Promise<void> {
        const {freelancerId,educationId} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await EducationService.deleteEducation(freelancer!,educationId)

    }

    
}
