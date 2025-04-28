import prisma from "../helpers/prisma.js";
import { deleteImageFromCloudinary, imageUploadToCloudinary } from "../helpers/image.upload.js";



export const addCompanyDetails = async (req, res) => {
  const { location, email, phone, mapUrl } = req.body;

  try {
    const existingSettings = await prisma.companySettings.findFirst();
    let logo_result, favicon_result;

    // Process logo upload
    if (req.files?.logo) {
      if (existingSettings?.logo) {
        const publicId = existingSettings.logo.split('/').slice(-2).join('/').split('.')[0];
        await deleteImageFromCloudinary(publicId);
      }

      const folderPath = 'theREHApie/organizationLogo';
      const result = await imageUploadToCloudinary(req.files.logo[0], folderPath);
      logo_result = result.secure_url;
    }

    // Process favicon upload
    if (req.files?.favicon) {
      if (existingSettings?.favicon) {
        const publicId = existingSettings.favicon.split('/').slice(-2).join('/').split('.')[0];
        await deleteImageFromCloudinary(publicId);
      }

      const folderPath = 'theREHApie/organizationFavicon';
      const result = await imageUploadToCloudinary(req.files.favicon[0], folderPath);
      favicon_result = result.secure_url;
    }

    const updateData = {
      location,
      email,
      phone,
      mapUrl,
      ...(logo_result && { logo: logo_result }),
      ...(favicon_result && { favicon: favicon_result }),
    };

    const settings = await prisma.companySettings.upsert({
      where: { id: existingSettings?.id || "" },
      update: updateData,
      create: updateData,
    });

    res.status(200).json({
      message: existingSettings ? "Company settings updated successfully" : "Company details created successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ 
      message: "Error processing request",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {    
    const settings = await prisma.companySettings.findFirst();
    if (!settings) {
      return res.status(404).json({ message: "Company settings not found" });
    }

    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }

}