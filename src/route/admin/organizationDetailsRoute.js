import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import { addCompanyDetails, getCompanyDetails } from "../../controller/organizationDetailsController.js";


const router = express.Router();



router.post('/settings', 
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'favicon', maxCount: 1 }
    ]),
    addCompanyDetails
  );
  router.get('/settings',getCompanyDetails)


export default router;