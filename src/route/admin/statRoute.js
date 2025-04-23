import express from "express";
import { totalCounts, selectiveCounts } from "../../controller/statController.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();

// Protected routes that require authentication
router.get("/total-counts", verifyJwtToken, totalCounts);
router.get("/selective-counts", verifyJwtToken, selectiveCounts); //  can use as GET /api/admin/stats/selective-counts?entities=clients,blogs



export default router;