import express from "express";

import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import { createTestimonial, deleteTestimonial, getAllTestimonials, updateTestimonial } from "../../controller/testimonialsController.js";

const router = express.Router();

// Testimonial routes
router.post("/testimonial", verifyJwtToken, createTestimonial);
router.get("/testimonials", verifyJwtToken,getAllTestimonials);
router.put("/testimonial/:id", verifyJwtToken, updateTestimonial);
router.delete("/testimonial/:id", verifyJwtToken, deleteTestimonial);

// Privacy Policy routes
// router.post("/create-policy", verifyJwtToken, createPrivacyPolicy);
// router.get("/get-policies", getAllPrivacyPolicies);
// router.put("/update-policy/:id", verifyJwtToken, updatePrivacyPolicy);
// router.delete("/delete-policy/:id", verifyJwtToken, deletePrivacyPolicy);

export default router; 