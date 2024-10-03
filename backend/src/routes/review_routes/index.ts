import express from 'express';
import clientReviewRouter from './client_review_route';
import freelancerReviewRouter from './freelancer_review_route';
import reviewRouter from './review_route';

const router = express.Router();

router.use('/client',clientReviewRouter)
router.use('/freelancer',freelancerReviewRouter)
router.use(reviewRouter)

export default router;