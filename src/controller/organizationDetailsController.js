import prisma from "../helpers/prisma.js";
import { deleteImageFromCloudinary, imageUploadToCloudinary } from "../helpers/image.upload.js";




export const addCompanyDetails = async (req, res) => {
  const { logo, location, email, phone, mapUrl } = req.body;

  try {
    const existingSettings = await prisma.companySettings.findFirst();
    let logo_result

    if (req.file) {

      if (existingSettings?.logo) {
        const publicId = existingSettings.logo.split('/').slice(7, -1).join('/') + '/' + existingSettings.logo.split('/').pop().split('.')[0];
        await deleteImageFromCloudinary(publicId);
      }

      const folderPath = 'vsg/settings';
      const result = await imageUploadToCloudinary(req.file, folderPath);


      logo_result = result.secure_url;
    }
    const settings = await prisma.companySettings.upsert({
      where: { id: existingSettings?.id || "" },
      update: { logo: logo_result, location, email, phone, mapUrl },
      create: { logo: logo_result, location, email, phone, mapUrl },
    });

    res.status(200).json({
      message: existingSettings ? "Company settings updated successfully" : "Company Detailes created successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Error processing request", error });
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