import express from 'express'
import authRoutes from '../admin/authRoute.js'
import statRoutes from '../admin/statRoute.js'
import UserRoutes from './user.routes.js'
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/stat", statRoutes);
router.use("/user", UserRoutes);
export default router