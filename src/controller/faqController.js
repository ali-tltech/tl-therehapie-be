import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';

export const createFAQ = async (req, res) => {
    const { question, answer, order, isHomeFaq = false } = req.body;

    // Validate required fields
    if (!question || !answer || !order) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {
        // If trying to set as Home FAQ, check the limit
        if (isHomeFaq) {
            const homeFaqCount = await prisma.fAQ.count({
                where: { isHomeFaq: true }
            });

            if (homeFaqCount >= 4) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 4 Home FAQs allowed. Please disable another Home FAQ first."
                });
            }
        }

        const faq = await prisma.fAQ.create({
            data: {
                id: uuidv4(),
                question,
                answer,
                order,
                isHomeFaq
            }
        });

        return res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            data: faq
        });

    } catch (error) {
        console.error("Error creating FAQ:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the FAQ"
        });
    }
};

export const getAllFAQs = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: {
                order: 'asc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "FAQs fetched successfully",
            data: faqs
        });

    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching FAQs"
        });
    }
};

export const getHomeFAQs = async (req, res) => {
    try {
        const homeFaqs = await prisma.fAQ.findMany({
            where: { isHomeFaq: true },
            orderBy: {
                order: 'asc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "Home FAQs fetched successfully",
            data: homeFaqs
        });

    } catch (error) {
        console.error("Error fetching Home FAQs:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Home FAQs"
        });
    }
};

export const updateFAQ = async (req, res) => {
    const { id } = req.params;
    const { question, answer, order, isHomeFaq = false } = req.body;

    // Validate required fields
    if (!question || !answer || !order) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {
        // Check if FAQ exists
        const existingFAQ = await prisma.fAQ.findUnique({
            where: { id }
        });

        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        // If trying to set as Home FAQ and it wasn't already a Home FAQ, check the limit
        if (isHomeFaq && !existingFAQ.isHomeFaq) {
            const homeFaqCount = await prisma.fAQ.count({
                where: { isHomeFaq: true }
            });

            if (homeFaqCount >= 4) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 4 Home FAQs allowed. Please disable another Home FAQ first."
                });
            }
        }

        // Update FAQ
        const updatedFAQ = await prisma.fAQ.update({
            where: { id },
            data: {
                question,
                answer,
                order,
                isHomeFaq,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: updatedFAQ
        });

    } catch (error) {
        console.error("Error updating FAQ:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the FAQ"
        });
    }
};

export const deleteFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if FAQ exists
        const existingFAQ = await prisma.fAQ.findUnique({
            where: { id }
        });

        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        // Delete FAQ
        await prisma.fAQ.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "FAQ deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting FAQ:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the FAQ"
        });
    }
};