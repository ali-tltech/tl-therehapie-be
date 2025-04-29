import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from "../../controller/blogController.js";

const router = express.Router();

router.post("/create-blog",verifyJwtToken,upload.single("image"),createBlog);
router.get("/get-all-blogs",verifyJwtToken, getAllBlogs);
router.put("/update-blog/:id",verifyJwtToken,upload.single('image'), updateBlog);
router.delete("/delete-blog/:id",verifyJwtToken, deleteBlog);

export default router;