import express from "express";
import { getAllFAQs, getHomeFAQs, getPageFAQs } from "../../controller/faqController.js";

const router = express.Router();

// Add these routes with your existing routes

router.get("/get-page-faqs", getPageFAQs);
router.get("/get-home-faqs", getHomeFAQs);
export default router;