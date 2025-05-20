import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";
import enquiriesRoutes from "./enquiries.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import blogRoutes from "./blog.routes.js";



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)
router.use("/enquiries", enquiriesRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/blog",blogRoutes);





export default router;