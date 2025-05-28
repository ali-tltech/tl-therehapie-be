import express from "express";
import { getPrivacyPolicy, getTermsAndConditions } from "../../controller/document.controller.js";


const router = express.Router();


router.get("/get-privacy", getPrivacyPolicy);
router.get("/get-terms", getTermsAndConditions);


export default router; 