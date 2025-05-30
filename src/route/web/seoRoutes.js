import express from 'express';
import { getSEOWithParams } from '../../controller/seocontroller.js';


const router = express.Router();


router.get('/get-seo/:pageTitle', getSEOWithParams)


export default router;