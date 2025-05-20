import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';
import {deleteImageFromCloudinary, imageUploadToCloudinary} from "../helpers/image.upload.js";


export const createBlog = async (req, res) => {
    const { title, author, date, excerpt, content } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided', success: false });
    }

    // Validate required fields
    if (!title || !author || !date || !excerpt || !content) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {

        const folderPath = 'theRehapie/blogs';
        const result = await imageUploadToCloudinary(req.file, folderPath);
        // Create new blog post
        const blog = await prisma.blog.create({
            data: {
                id: uuidv4(),
                title,
                author,
                date: new Date(date),
                image: result.secure_url,
                excerpt,
                content
            }
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the blog"
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: {
                date: 'desc'  
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching blogs"
        });
    }
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;
        console.log(req.params);
    try {
        const blog = await prisma.blog.findUnique({
            where: { id },
          
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });

    } catch (error) {
        console.error("Error fetching service:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the Blog"
        });
    }
}

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const new_data = req.body;

    // Validate required fields
    if (!new_data.title || !new_data.author || !new_data.date || !new_data.excerpt || !new_data.content) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    // Ensure date is correctly formatted
    new_data.date = new Date(new_data.date);  // Convert the date to a JavaScript Date object if it's in string format

    try {
        // Check if blog exists
        const existingBlog = await prisma.blog.findUnique({
            where: { id }
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // If there's a new file uploaded
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (existingBlog.image) {
                const publicId = existingBlog.image.split('/').slice(7, -1).join('/') + '/' + existingBlog.image.split('/').pop().split('.')[0];
                await deleteImageFromCloudinary(publicId);  // Delete the image from Cloudinary
            }

            // Upload the new image
            const folderPath = 'theRehapie/blogs';
            const result = await imageUploadToCloudinary(req.file, folderPath);

            new_data.image = result.secure_url;  // Update the image URL in the data to be saved
        }

        // Update blog
        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                ...new_data,
                updatedAt: new Date()  // Automatically set the updated timestamp
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the blog"
        });
    }
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if blog exists
        const existingBlog = await prisma.blog.findUnique({
            where: { id }
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        const publicId = existingBlog.image.split('/').slice(7, -1).join('/') + '/' + existingBlog.image.split('/').pop().split('.')[0];
        await deleteImageFromCloudinary(publicId);

        // Delete blog
        await prisma.blog.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the blog"
        });
    }
};

