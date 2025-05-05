import express from 'express';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';
import { getSEO, upsertSEO } from '../../controller/seocontroller.js';

const router = express.Router();

router.get('/get/:pageTitle',verifyJwtToken, getSEO);
router.post('/upsert/:pageTitle',verifyJwtToken, upsertSEO);

export default router;