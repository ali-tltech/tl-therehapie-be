import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import {
  createOrUpdateService,
  getAllServices
} from "../../controller/serviceController.js";

const router = express.Router();

router.post("/create-or-update-service", upload.single("image"), createOrUpdateService);
router.get("/get-all-services", getAllServices);

export default router;
