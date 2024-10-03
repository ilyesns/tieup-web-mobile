import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import FreelancerSkillsController from '../../controllers/freelancer_controllers/freelancer_details_controllers/freelancer_skills_controllers';

// Create a new router
const router = express.Router();

router.post('/add-skill', async (req: Request, res: Response) => {
    try {
        const data: DynamicObject = req.body; // data should contain userId and Skill data.
        if(!data)
          throw('Missing Doc Id')

         await FreelancerSkillsController.createSkill(data);
        res.status(200).send({ message: 'freelancer Skill create successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to create freelancer Skill', error: error!.toString() });
    }
});

router.post('/update-skill',async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body

        const data: DynamicObject = req.body;

         await FreelancerSkillsController.updateSkill(data);
        res.status(200).send({ message: 'freelancer Skill update item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer Skill to update item', error: error!.toString() });
    }
});
router.post('/delete-skill', async (req: Request, res: Response) => {
    try {
      
        const data: DynamicObject = req.body;
        if (!data) throw new Error('Missing Doc data');

         await FreelancerSkillsController.deleteSkill(data);
        res.status(200).send({ message: 'freelancer Skill delete item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer Skill to delete item', error: error!.toString() });
    }
});

export default router;