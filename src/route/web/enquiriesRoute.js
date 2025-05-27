import express from "express";
import { createContactEnquiry } from "../../controller/enquiries.controller.js";

const router = express.Router();

router.post("/create-enquiry", createContactEnquiry);



export default router; 