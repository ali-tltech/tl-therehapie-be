import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';

export const createTestimonial = async (req, res) => {
    const { text, author, position, TestimonialUrl } = req.body;

    // Only text is required now
    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Testimonial text is required"
        });
    }

    try {
        // Prepare data object with only non-empty values
        const testimonialData = {
            id: uuidv4(),
            text: text.trim(),
        };

        // Add optional fields only if they have values
        if (author && author.trim() !== '') {
            testimonialData.author = author.trim();
        }

        if (position && position.trim() !== '') {
            testimonialData.position = position.trim();
        }

        if (TestimonialUrl && TestimonialUrl.trim() !== '') {
            testimonialData.TestimonialUrl = TestimonialUrl.trim();
        }

        const testimonial = await prisma.testimonial.create({
            data: testimonialData
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
    const { text, author, position, TestimonialUrl } = req.body;

    // Only text is required now
    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Testimonial text is required"
        });
    }

    try {
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        // Prepare update data object
        const updateData = {
            text: text.trim(),
            updatedAt: new Date()
        };

        // Handle optional fields - set to null if empty, otherwise update
        updateData.author = (author && author.trim() !== '') ? author.trim() : null;
        updateData.position = (position && position.trim() !== '') ? position.trim() : null;
        updateData.TestimonialUrl = (TestimonialUrl && TestimonialUrl.trim() !== '') ? TestimonialUrl.trim() : null;

        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: updateData
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
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

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