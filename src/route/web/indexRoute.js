import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";
import enquiriesRoutes from "./enquiriesRoute.js";
import faqRoutes from "./faqRoute.js";
import newsletterRoutes from "./newsletterRoute.js";
import blogRoutes from "./blogRoute.js";
import testimonialRoutes from "./testimonialRoute.js";
import documentRoutes from "./document.route.js"
import serviceRoute from './serviceRoute.js'



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)
router.use("/enquiries", enquiriesRoutes);
router.use("/faqs", faqRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/blog",blogRoutes);
router.use("/testimonial", testimonialRoutes);
router.use('/document', documentRoutes)
router.use('/service', serviceRoute)






export default router;