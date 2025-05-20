import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";
import enquiriesRoutes from "./enquiries.routes.js";
import faqRoutes from "./faqRoute.js";
import newsletterRoutes from "./newsletter.routes.js";



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)
router.use("/enquiries", enquiriesRoutes);
router.use("/faqs", faqRoutes);
router.use("/newsletter", newsletterRoutes);





export default router;