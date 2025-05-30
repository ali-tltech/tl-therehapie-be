import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import {
  createOrUpdateService,
  getAllServices,
  getServiceByTitle, // Import the new function
} from "../../controller/serviceController.js";

const router = express.Router();

router.post("/create-or-update-service", upload.single("image"), createOrUpdateService);
router.get("/get-all-services", getAllServices);

// ✅ Add this new route for fetching service by title
router.get("/get-service-by-title/:title", getServiceByTitle);

export default router;
