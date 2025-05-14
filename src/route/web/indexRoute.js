import express from "express";

import socialRoutes from "./socialRoute.js";
import organizationDetailsRoutes from "./organizationDetailsRoute.js";



const router = express.Router();
router.use('/social', socialRoutes);
router.use('/organization', organizationDetailsRoutes)




export default router;