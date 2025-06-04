import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';

export const createFAQ = async (req, res) => {
    const { question, answer, order, homeOrder, isHomeFaq = false } = req.body;

    // Validate required fields
    if (!question || !answer) {
        return res.status(400).json({
            success: false,
            message: "Please provide question and answer"
        });
    }

    // Validate order fields based on FAQ type
    if (isHomeFaq && !homeOrder) {
        return res.status(400).json({
            success: false,
            message: "homeOrder is required for Home FAQs"
        });
    }

    if (!isHomeFaq && !order) {
        return res.status(400).json({
            success: false,
            message: "order is required for Page FAQs"
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

        // Check for duplicate questions using case-insensitive search
        const trimmedQuestion = question.trim();
        const existingFAQ = await prisma.fAQ.findFirst({
            where: {
                question: trimmedQuestion
            }
        });

        if (existingFAQ) {
            return res.status(400).json({
                success: false,
                message: "This question already exists. Please enter a different question."
            });
        }

        const faq = await prisma.fAQ.create({
            data: {
                id: uuidv4(),
                question: trimmedQuestion,
                answer: answer.trim(),
                order: isHomeFaq ? null : order,
                homeOrder: isHomeFaq ? homeOrder : null,
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
            orderBy: [
                { isHomeFaq: 'desc' }, // Home FAQs first
                { homeOrder: 'asc' },  // Then by homeOrder for home FAQs
                { order: 'asc' }       // Then by order for page FAQs
            ]
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

export const getPageFAQs = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: {
                isHomeFaq: false
            },
            orderBy: {
                order: 'asc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "Page FAQs fetched successfully",
            data: faqs
        });

    } catch (error) {
        console.error("Error fetching Page FAQs:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching page FAQs"
        });
    }
};

export const getHomeFAQs = async (req, res) => {
    try {
        const homeFaqs = await prisma.fAQ.findMany({
            where: { isHomeFaq: true },
            orderBy: {
                homeOrder: 'asc'
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
    const { question, answer, order, homeOrder, isHomeFaq = false } = req.body;

    // Validate required fields
    if (!question || !answer) {
        return res.status(400).json({
            success: false,
            message: "Please provide question and answer"
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

        // Check for duplicate questions (excluding current FAQ) using case-insensitive search
        const trimmedQuestion = question.trim();
        const duplicateFAQ = await prisma.fAQ.findFirst({
            where: {
                question: trimmedQuestion,
                id: {
                    not: id
                }
            }
        });

        if (duplicateFAQ) {
            return res.status(400).json({
                success: false,
                message: "This question already exists. Please enter a different question."
            });
        }

        // Prepare update data based on FAQ type
        const updateData = {
            question: trimmedQuestion,
            answer: answer.trim(),
            isHomeFaq,
            updatedAt: new Date()
        };

        // Set appropriate order fields
        if (isHomeFaq) {
            updateData.homeOrder = homeOrder;
            updateData.order = null;
        } else {
            updateData.order = order;
            updateData.homeOrder = null;
        }

        // Update FAQ
        const updatedFAQ = await prisma.fAQ.update({
            where: { id },
            data: updateData
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

        // Reorder remaining FAQs if needed
        if (existingFAQ.isHomeFaq) {
            // Reorder home FAQs
            const remainingHomeFaqs = await prisma.fAQ.findMany({
                where: { isHomeFaq: true },
                orderBy: { homeOrder: 'asc' }
            });

            // Update home orders sequentially
            for (let i = 0; i < remainingHomeFaqs.length; i++) {
                await prisma.fAQ.update({
                    where: { id: remainingHomeFaqs[i].id },
                    data: { homeOrder: i + 1 }
                });
            }
        } else {
            // Reorder page FAQs
            const remainingPageFaqs = await prisma.fAQ.findMany({
                where: { isHomeFaq: false },
                orderBy: { order: 'asc' }
            });

            // Update orders sequentially
            for (let i = 0; i < remainingPageFaqs.length; i++) {
                await prisma.fAQ.update({
                    where: { id: remainingPageFaqs[i].id },
                    data: { order: i + 1 }
                });
            }
        }

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