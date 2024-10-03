import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import ClientReviewControllers from '../../controllers/review_controllers/client_review_controllers';

// Create a new router
const router = express.Router();

router.post('/add-review', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
        const result =  await ClientReviewControllers.addReview(data);
        res.status(200).send({message: 'review sent successfuly'});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to add review', error: error!.toString() });
    }
});


export default router