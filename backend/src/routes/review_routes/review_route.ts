import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import FreelancerReviewControllers from '../../controllers/review_controllers/freelancer_review_controllers';
import ReviewControllers from '../../controllers/review_controllers/review_controllers';

// Create a new router
const router = express.Router();

router.get('/read-reviews-offer-id', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
        const reviews =  await ReviewControllers.getAllReviewsByOfferId(data);
        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to read review by offer id', error: error!.toString() });
    }
});
router.get('/read-reviews-reviewer-id', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
        const reviews =  await ReviewControllers.getAllReviewsByClientId(data);
        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to read review by reviewer id', error: error!.toString() });
    }
});
router.get('/read-reviews-target-id', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
        const reviews =  await ReviewControllers.getAllReviewsByFreelancerId(data);
        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to read review by target id', error: error!.toString() });
    }
});


export default router