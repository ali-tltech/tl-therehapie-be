import express from "express";
import { getAllTestimonials } from "../../controller/testimonialsController.js";

const router = express.Router();


router.get("/getAll-testimonials", getAllTestimonials);


export default router; 