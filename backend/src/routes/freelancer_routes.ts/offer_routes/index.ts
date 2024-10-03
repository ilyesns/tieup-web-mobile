import express from 'express';
import planRouter from './freelancer_offer_plan_route';
import galleryRouter from './freelancer_offer_gallery_route';
import offerRouter from './freelancer_offer_route';

const router = express.Router();


export default router.use('/offer',planRouter,galleryRouter,offerRouter);