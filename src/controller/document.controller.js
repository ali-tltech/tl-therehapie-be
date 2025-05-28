import prisma from "../helpers/prisma.js";


const validTypes = ['PRIVACY', 'TERMS', ];

/**
 * Controller to create a document.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */



export const createDocument = async (req, res) => {
  const { title, content, type } = req.body;

  if (!title || !content || !type) {
    return res.status(400).json({ error: "Title, content, and type are required." });
  }

  if (!validTypes.includes(type.toUpperCase())) {
    return res.status(400).json({ error: `Invalid type. Valid types are: ${validTypes.join(', ')}` });
  }

  try {
    // Use upsert to create or update the document
    const document = await prisma.documents.upsert({
      where: { type: type },
      update: {
        title: title,
        content: content,
      },
      create: {
        title: title,
        content: content,
        type: type.toUpperCase(),
      },
    });

    return res.status(201).json({
      message: "Document upserted successfully.",
      document,
    });
  } catch (error) {
    console.error("Error upserting document:", error);
    return res.status(500).json({ error: "Internal Server Error. Failed to upsert document." });
  }
};




export const getDocumentByType = async (req, res) => {
  const { type } = req.params;

  if (!type) {
    return res.status(400).json({ error: "Document type is required." });
  }

  if (!validTypes.includes(type.toUpperCase())) {
    return res.status(400).json({ error: `Invalid type. Valid types are: ${validTypes.join(', ')}` });
  }

  try {
    // Fetch the document by type
    const document = await prisma.documents.findFirst({
      where: { type: type.toUpperCase() },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found for the given type." });
    }

    return res.status(200).json({
      message: "Document retrieved successfully.",
      document,
    });
  } catch (error) {
    console.error("Error fetching document by type:", error);
    return res.status(500).json({ error: "Internal Server Error. Failed to fetch document." });
  }
};


export const getPolicy = async (req, res) => {
  const { type } = req.params;

  if (!type) {
    return res.status(400).json({ error: "Document type is required." });
  }

  if (!validTypes.includes(type.toUpperCase())) {
    return res.status(400).json({ error: `Invalid type. Valid types are: ${validTypes.join(', ')}` });
  }

  try {
    // Fetch the document by type
    const document = await prisma.documents.findFirst({
      where: { type: type.toUpperCase() },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found for the given type." });
    }

    return res.status(200).json({
      message: "Document retrieved successfully.",
      document,
    });
  } catch (error) {
    console.error("Error fetching document by type:", error);
    return res.status(500).json({ error: "Internal Server Error. Failed to fetch document." });
  }
};



export const getPrivacyPolicy = async (req, res) => {
  try {
    const document = await prisma.documents.findFirst({
      where: { type: "PRIVACY" }, // Assuming "PRIVACY" is the type for privacy policy
    });

    if (!document) {
      return res.status(404).json({ error: "Privacy policy not found." });
    }

    return res.status(200).json({
      message: "Privacy policy retrieved successfully.",
      document,
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return res.status(500).json({ error: "Internal Server Error. Failed to fetch privacy policy." });
  }
};

export const getTermsAndConditions = async (req, res) => {
  try {
    const document = await prisma.documents.findFirst({
      where: { type: "TERMS" }, // Assuming "TERMS" is the type for terms & conditions
    });

    if (!document) {
      return res.status(404).json({ error: "Terms and conditions not found." });
    }

    return res.status(200).json({
      message: "Terms and conditions retrieved successfully.",
      document,
    });
  } catch (error) {
    console.error("Error fetching terms and conditions:", error);
    return res.status(500).json({ error: "Internal Server Error. Failed to fetch terms and conditions." });
  }
};
