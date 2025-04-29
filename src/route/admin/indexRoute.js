import express from 'express'
import authRoutes from './authRoute.js'
import statRoutes from './statRoute.js'
import UserRoutes from './user.routes.js'
import blogRoutes from './blogRoute.js'
import OrganizationDetailsRoutes from './organizationDetailsRoute.js'
const router = express.Router();



router.use("/auth", authRoutes);
router.use("/stats", statRoutes);
router.use("/users", UserRoutes);
router.use("/organization", OrganizationDetailsRoutes);
router.use("/blog", blogRoutes);




export default router