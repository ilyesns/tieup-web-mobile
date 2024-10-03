import express, { Request, Response } from 'express';
import { DynamicObject } from '../../../models/utilities/util';
import OfferStatisticController from '../../../controllers/freelancer_controllers/offer_statistic_controllers/offer_statistic_controllers';

// Create a new router
const router = express.Router();

router.get('/read-offer-static-freelancer-id', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing Doc Id')

       const offerStat =   await OfferStatisticController.getOfferStatisticBy(data.freelancerId);
        res.status(200).json(offerStat);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to get offer statistic', error: error!.toString() });
    }
});
router.get('/read-offers-static-freelancer-id', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing Doc Id')

        const offers = await OfferStatisticController.getAllOfferStatisticBy(data.freelancerId);
        res.status(200).json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to get freelancer offer statuc', error: error!.toString() });
    }
});
router.post('/update-click-offers-static', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing Doc Id')

       await OfferStatisticController.clicks(data.offerId);
        res.status(200).send({ message: 'update offer static click successfuly ' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to update offer static click', error: error!.toString() });
    }
});
router.post('/update-impressions-offers-static', async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing Doc Id')

       await OfferStatisticController.Impressions(data.offerId);
        res.status(200).send({ message: 'updated offer static impressions successfuly to get freelancer offers' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to get freelancer offers', error: error!.toString() });
    }
});


export default router;