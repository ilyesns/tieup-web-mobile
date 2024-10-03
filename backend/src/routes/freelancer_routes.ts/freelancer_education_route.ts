import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import FreelancerEducationController from '../../controllers/freelancer_controllers/freelancer_details_controllers/freelancer_education_controllers';

// Create a new router
const router = express.Router();

router.post('/add-education', async (req: Request, res: Response) => {
    try {
        const data: DynamicObject = req.body; // data should contain userId and education data.
        if(!data)
          throw('Missing Doc Id')

         await FreelancerEducationController.createEducation(data);
        res.status(200).send({ message: 'freelancer education create successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to create freelancer education', error: error!.toString() });
    }
});

router.post('/update-education',async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body

        const data: DynamicObject = req.body;

         await FreelancerEducationController.updateEducation(data);
        res.status(200).send({ message: 'freelancer education update item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer education to update item', error: error!.toString() });
    }
});
router.post('/delete-education', async (req: Request, res: Response) => {
    try {
      
        const data: DynamicObject = req.body;
        if (!data) throw new Error('Missing Doc data');

         await FreelancerEducationController.deleteEducation(data);
        res.status(200).send({ message: 'freelancer education delete item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer education to delete item', error: error!.toString() });
    }
});

export default router;