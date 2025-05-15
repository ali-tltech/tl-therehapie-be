import express from "express";

import { getNewsletterSubscribers, sendBulkNewsletter } from "../../controller/newsletter.controller.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();



router.post("/send-newsletter",verifyJwtToken, sendBulkNewsletter  );
router.get("/get-all-subscribers",verifyJwtToken,getNewsletterSubscribers)


export default router; 