import express from 'express';
import clientRevisionRouter from './client_revision';
import freelancerRevisionRouter from './freelancer_revision';

const router = express.Router();

router.use('/client',clientRevisionRouter)
router.use('/freelancer',freelancerRevisionRouter)

export default router;