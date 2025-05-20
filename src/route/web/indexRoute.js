import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";
import enquiriesRoutes from "./enquiries.routes.js";
import faqRoutes from "./faqRoute.js";



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)
router.use("/enquiries", enquiriesRoutes);
router.use("/faqs", faqRoutes);





export default router;