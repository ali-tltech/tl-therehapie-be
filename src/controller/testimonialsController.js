import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';




export const createTestimonial = async (req, res) => {
    const { text, author, position, rating } = req.body;

    // Validate required fields
    if (!text || !author || !position || !rating) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    try {
        const testimonial = await prisma.testimonial.create({
            data: {
                id: uuidv4(),
                text,
                author,
                position,
                rating
            }
        });

        return res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial
        });

    } catch (error) {
        console.error("Error creating testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the testimonial"
        });
    }
};

export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            data: testimonials
        });

    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching testimonials"
        });
    }
};

export const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { text, author, position, rating } = req.body;

    // Validate required fields
    if (!text || !author || !position || !rating) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    try {
        // Check if testimonial exists
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        // Update testimonial
        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                text,
                author,
                position,
                rating,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: updatedTestimonial
        });

    } catch (error) {
        console.error("Error updating testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the testimonial"
        });
    }
};

export const deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if testimonial exists
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        // Delete testimonial
        await prisma.testimonial.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the testimonial"
        });
    }
}; 