import express from "express";

import socialRoutes from "./socialRoute.js";



const router = express.Router();
router.use('/social', socialRoutes);




export default router;