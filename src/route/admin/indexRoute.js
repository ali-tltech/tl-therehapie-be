import express from 'express'
import authRoutes from './authRoute.js'
import statRoutes from './statRoute.js'
import UserRoutes from './userRoute.js'
import blogRoutes from './blogRoute.js'
import OrganizationDetailsRoutes from './organizationDetailsRoute.js'
import socialRoutes from "./socialRoute.js";
import seoRoutes from "./seoRoute.js"
import emailConfigRoutes from "./emailConfigRoute.js"

const router = express.Router();



router.use("/auth", authRoutes);
router.use("/stats", statRoutes);
router.use("/users", UserRoutes);
router.use("/organization", OrganizationDetailsRoutes);
router.use("/blog", blogRoutes);
router.use('/social', socialRoutes);
router.use("/seo",seoRoutes)
router.use("/seo",seoRoutes)
router.use('/config', emailConfigRoutes);




export default router