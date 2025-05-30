import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from "uuid";
import {
  imageUploadToCloudinary,
  deleteImageFromCloudinary,
} from "../helpers/image.upload.js";

// Allowed titles
const allowedTitles = [
  "Manufactures",
  "Distributors",
  "Healthcare  Providers",
];

// Create or Replace Service
export const createOrUpdateService = async (req, res) => {
  const {
    title,
    tagline,
    taglineDescription,
    servicePoints,
    content,
  } = req.body;

  if (!title || !tagline || !taglineDescription || !content) {
    return res.status(400).json({
      success: false,
      message: "All fields (title, tagline, taglineDescription, content) are required",
    });
  }

  if (!allowedTitles.includes(title)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service title. Allowed: Manufactures, Distributors, Healthcare  Providers",
    });
  }

  try {
    const existingService = await prisma.service.findUnique({ where: { title }, include: { servicePoints: true } });

    let imageUrl = existingService?.image || null;

    // Handle image upload
    if (req.file) {
      if (imageUrl) {
        const publicId = imageUrl.split('/').slice(7, -1).join('/') + '/' + imageUrl.split('/').pop().split('.')[0];
        await deleteImageFromCloudinary(publicId);
      }

      const uploaded = await imageUploadToCloudinary(req.file, 'services');
      imageUrl = uploaded.secure_url;
    }

    // Parse servicePoints if stringified
    let parsedPoints = [];
    if (typeof servicePoints === "string") {
      parsedPoints = JSON.parse(servicePoints);
    } else if (Array.isArray(servicePoints)) {
      parsedPoints = servicePoints;
    }

    // Create servicePoints data
    const pointsData = parsedPoints.map(point => ({
      id: uuidv4(),
      point,
    }));

    let service;

    if (existingService) {
      // Delete old servicePoints
      await prisma.servicePoint.deleteMany({
        where: { serviceId: existingService.id }
      });

      service = await prisma.service.update({
        where: { title },
        data: {
          tagline,
          taglineDescription,
          content,
          image: imageUrl,
          servicePoints: {
            create: pointsData
          }
        },
        include: { servicePoints: true },
      });
    } else {
      service = await prisma.service.create({
        data: {
          id: uuidv4(),
          title,
          tagline,
          taglineDescription,
          content,
          image: imageUrl,
          servicePoints: {
            create: pointsData
          }
        },
        include: { servicePoints: true },
      });
    }

    return res.status(200).json({
      success: true,
      message: existingService ? "Service updated successfully" : "Service created successfully",
      data: service,
    });

  } catch (error) {
    console.error("Error creating/updating service:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get all services
export const getAllServices = async (req, res) => {
  try {

    const services = await prisma.service.findMany({
      where: {
        title: {
          in: allowedTitles,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching services",
    });
  }
};

export const getServiceByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const service = await prisma.service.findFirst({
      where: {
        title: title,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service by title:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the service",
    });
  }
};
