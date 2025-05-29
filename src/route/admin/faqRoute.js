import express from "express";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import { createFAQ, deleteFAQ, getAllFAQs, getHomeFAQs, updateFAQ } from "../../controller/faqController.js";

const router = express.Router();

// Add these routes with your existing routes
router.post("/create-faq",verifyJwtToken, verifyJwtToken, createFAQ);
router.get("/get-faqs", verifyJwtToken,getAllFAQs);
router.put("/update-faq/:id", verifyJwtToken, updateFAQ);
router.delete("/delete-faq/:id", verifyJwtToken, deleteFAQ);
router.get("/get-home-faqs", verifyJwtToken, getHomeFAQs);
export default router;