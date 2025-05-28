import express from "express";
import { getAllFAQs } from "../../controller/faqController.js";

const router = express.Router();

// Add these routes with your existing routes

router.get("/get-faqs", getAllFAQs);

export default router;