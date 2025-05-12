import express from "express";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import { getEmailConfiguration, sendTestEmail, upsertEmailConfig } from "../../controller/emailConfigController.js";



const router = express.Router();


router.get('/email-config',verifyJwtToken,getEmailConfiguration)
router.put("/email-config/:id",verifyJwtToken, upsertEmailConfig);
router.post("/test-email",verifyJwtToken, sendTestEmail);



export default router;