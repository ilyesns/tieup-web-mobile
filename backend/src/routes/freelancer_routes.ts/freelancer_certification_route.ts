import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import FreelancerCertificationController from '../../controllers/freelancer_controllers/freelancer_details_controllers/freelancer_certification_controllers';

// Create a new router
const router = express.Router();

router.post('/add-certification', async (req: Request, res: Response) => {
    try {
        const data: DynamicObject = req.body; // data should contain userId and Certification data.
        if(!data)
          throw('Missing Doc Id')

         await FreelancerCertificationController.createCertification(data);
        res.status(200).send({ message: 'freelancer Certification create successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to create freelancer Certification', error: error!.toString() });
    }
});

router.post('/update-certification',async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body

        const data: DynamicObject = req.body;

         await FreelancerCertificationController.updateCertification(data);
        res.status(200).send({ message: 'freelancer Certification update item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer Certification to update item', error: error!.toString() });
    }
});
router.post('/delete-certification', async (req: Request, res: Response) => {
    try {
      
        const data: DynamicObject = req.body;
        if (!data) throw new Error('Missing Doc data');

         await FreelancerCertificationController.deleteCertification(data);
        res.status(200).send({ message: 'freelancer Certification delete item successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed freelancer Certification to delete item', error: error!.toString() });
    }
});

export default router;