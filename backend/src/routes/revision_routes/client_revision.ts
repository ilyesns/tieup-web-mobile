import express, { Request, Response } from 'express';
import { DynamicObject } from '../../models/utilities/util';
import multer from 'multer';
import ClientRevisionControllers from '../../controllers/revision_controllers/client_revision_controllers';

const upload = multer({ storage: multer.memoryStorage() });


// Create a new router
const router = express.Router();

router.post('/request',upload.single('file') ,async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const file: Express.Multer.File = req.file as Express.Multer.File;
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
            await ClientRevisionControllers.requestRevision(data,file);
        res.status(200).send({message: 'request revision sent successfuly'});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to request revision', error: error!.toString() });
    }
});

router.post('/mark-as-complete',async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
    await ClientRevisionControllers.markRevisionComplete(data);
        res.status(200).send({message: 'marked revision as complete with successfuly'});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to mark revision as complete', error: error!.toString() });
    }
});
router.get('/read-all',async (req: Request, res: Response) => {
    try {
        // Assuming the data to update the user is coming in the request body
        const data: DynamicObject = req.body;
        if(!data)
          throw('Missing data')
        const result =  await ClientRevisionControllers.getAllRevisionsByOrderId(data);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'failed to read revisions', error: error!.toString() });
    }
});


export default router