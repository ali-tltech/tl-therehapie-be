import express from "express";
import  { verifyRole } from "../../middlewares/verifyJwtToken.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import { createUser, deleteUser, getAllUsers, getProfile, updateProfile, updateUser } from "../../controller/userController.js";
import { changePassword } from "../../controller/authController.js";
// import { changePassword } from "../../controllers/auth.controller.js";



const router = express.Router();




router.post("/create",verifyJwtToken, verifyRole('superadmin'), createUser);
router.get("/view", verifyJwtToken, verifyRole('superadmin'), getAllUsers);
router.put("/update/:id", verifyJwtToken, verifyRole('superadmin'), updateUser);
router.delete("/delete/:id", verifyJwtToken, verifyRole('superadmin'), deleteUser);

//profile
router.post("/change-password",verifyJwtToken,changePassword)
router.get('/get-profile',verifyJwtToken,getProfile)
router.put('/update-profile',verifyJwtToken,updateProfile)


export default router;