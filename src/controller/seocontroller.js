
import prisma from '../helpers/prisma.js'

// ** Get SEO Entries **
export const getSEO = async (req, res) => {

  const { pageTitle } = req.params;

  if (!pageTitle) {
    return res.status(400).json({ message: "pageTitle query parameter is required" });
  }
  try {
    const seoData = await prisma.sEO.findUnique({
      where: {
        pageTitle: pageTitle,
      },
    });

    if (!seoData) {
      return res.status(404).json({ message: "SEO data not found for this page" });
    }

    res.json(seoData);
  }
  catch (error) {
    console.error("Error fetching SEO data:", error);
    res.status(500).json({ message: "An error occurred while fetching SEO data" });
  }
};

// ** Create SEO Entry **
export const createSEO = async (req, res) => {
  const {
    pageTitle,
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage
  } = req.body;

  if (!pageTitle || !title || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (pageTitle, title, description)"
    });
  }

  try {
    const newSEO = await prisma.sEO.create({
      data: {
        pageTitle,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage
      }
    });

    return res.status(201).json({
      success: true,
      message: "SEO entry created successfully",
      data: newSEO
    });
  } catch (error) {
    console.error("Error creating SEO entry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the SEO entry"
    });
  }
};

// ** Update SEO Entry **
export const updateSEO = async (req, res) => {
  const { id } = req.params;
  const {
    pageTitle,
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage
  } = req.body;

  if (!pageTitle || !title || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (pageTitle, title, description)"
    });
  }

  try {
    const existingSEO = await prisma.sEO.findUnique({
      where: { id }
    });

    if (!existingSEO) {
      return res.status(404).json({
        success: false,
        message: "SEO entry not found"
      });
    }

    const updatedSEO = await prisma.sEO.update({
      where: { id },
      data: {
        pageTitle,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: "SEO entry updated successfully",
      data: updatedSEO
    });
  } catch (error) {
    console.error("Error updating SEO entry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the SEO entry"
    });
  }
};

// ** Delete SEO Entry **
export const deleteSEO = async (req, res) => {
  const { id } = req.params;

  try {
    const existingSEO = await prisma.sEO.findUnique({
      where: { id }
    });

    if (!existingSEO) {
      return res.status(404).json({
        success: false,
        message: "SEO entry not found"
      });
    }

    await prisma.sEO.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "SEO entry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting SEO entry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the SEO entry"
    });
  }
};




// ** Get SEO Entries Web **


export const getSEOWithParams = async (req, res) => {
  const { pageTitle } = req.params;

  if (!pageTitle) {
    return res.status(400).json({ message: "pageTitle query parameter is required" });
  }
  try {

    const seoData = await prisma.sEO.findUnique({
      where: {
        pageTitle: pageTitle,
      },
    });

    if (!seoData) {
      return res.status(404).json({ message: "SEO data not found for this page" });
    }

    res.json(seoData);
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    res.status(500).json({ message: "An error occurred while fetching SEO data" });
  }
}


export const upsertSEO = async (req, res) => {
  const { pageTitle } = req.params;
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = req.body;

  try {
    const seoData = await prisma.sEO.upsert({
      where: { pageTitle: pageTitle },
      update: {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterTitle,
        twitterDescription,
        twitterCard,
        twitterImage,
      },
      create: {
        pageTitle,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterTitle,
        twitterDescription,
        twitterCard,
        twitterImage,
      }
    });

    res.json({ message: 'SEO data saved successfully', seoData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while saving SEO data', error });
  }
};