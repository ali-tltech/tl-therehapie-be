import express from 'express';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';
import { createSEO, getSEO, upsertSEO } from '../../controller/seocontroller.js';

const router = express.Router();

router.get('/get/:pageTitle',verifyJwtToken, getSEO);
router.post('/upsert/:pageTitle',verifyJwtToken, upsertSEO);
// router.post('/create-seo', createSEO);

export default router;