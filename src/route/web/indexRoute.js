import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";
import enquiriesRoutes from "./enquiries.routes.js";



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)
router.use("/enquiries", enquiriesRoutes);





export default router;