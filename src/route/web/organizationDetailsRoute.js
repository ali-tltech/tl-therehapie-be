import express from "express";
import { getCompanyDetails } from "../../controller/organizationDetailsController.js";


const router = express.Router();


router.get("/get-details", getCompanyDetails);


export default router; 