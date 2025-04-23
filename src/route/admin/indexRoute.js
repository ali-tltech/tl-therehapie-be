import express from 'express'
import authRoutes from './authRoute.js'
import statRoutes from './statRoute.js'
import UserRoutes from './user.routes.js'
const router = express.Router();



router.use("/auth", authRoutes);
router.use("/stats", statRoutes);
router.use("/users", UserRoutes);




export default router