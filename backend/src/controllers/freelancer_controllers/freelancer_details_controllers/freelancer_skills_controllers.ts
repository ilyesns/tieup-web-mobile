import { DynamicObject } from "../../../models/utilities/util";
import EducationService from "../../../services/education_service";
import FreelancerService from "../../../services/freelancer_service";
import SkillService from "../../../services/skill_service";

export default class FreelancerSkillsController{
    
    static  async createSkill(data:DynamicObject): Promise<void> {
        const {freelancerId,skillData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await SkillService.addSkill(freelancer!,skillData)

    }
    static  async updateSkill(data:DynamicObject): Promise<void> {
        const {freelancerId,skillData} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await SkillService.updateSkill(freelancer!,skillData)

    }
    static  async deleteSkill(data:DynamicObject): Promise<void> {
        const {freelancerId,skillId} = data;
        const  freelancer = await FreelancerService.getFreelancer(freelancerId);
        await SkillService.deleteSkill(freelancer!,skillId)

    }

    


    
}
