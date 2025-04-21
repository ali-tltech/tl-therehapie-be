import express from 'express'
import authRoutes from '../admin/authRoute.js'
import statRoutes from '../admin/statRoute.js'
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/stat", statRoutes);
export default router