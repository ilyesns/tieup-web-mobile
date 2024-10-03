import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import FreelancerReviewControllers from '../../controllers/review_controllers/freelancer_review_controllers';

// Create a new router
const router = express.Router();

router.post('/reply-review', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
         await FreelancerReviewControllers.replyReview(data);
        res.status(200).json({message: 'reply sent successfuly'});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to sent reply', error: error!.toString() });
    }
});


export default router