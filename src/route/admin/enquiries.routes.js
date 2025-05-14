import express from "express";
import { deleteEnquiry, exportEnquiries, getAllEnquiries, getEnquirybyId, updateEnquiry } from "../../controller/enquiries.controller.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";


const router = express.Router();

// get all enquiries ,newsletter subscribers



router.get("/get-all-enquiries",verifyJwtToken, getAllEnquiries);
router.get("/get-enquiry/:id",verifyJwtToken,  getEnquirybyId);
router.patch("/update-status/:id", verifyJwtToken, updateEnquiry);
router.delete("/delete-enquiry/:id",verifyJwtToken,  deleteEnquiry);
router.get("/export-enquiry", verifyJwtToken, exportEnquiries);




export default router; 