import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from "../helpers/createNotification.js";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';





export const createContactEnquiry = async (req, res) => {
  const { name, subject, email, message } = req.body; // Renamed message to enquiryMessage

  // Validate required fields
  if (!name || !subject || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields"
    });
  }

  try {
    // Create new contact enquiry
    const contact = await prisma.enquiries.create({
      data: {
        id: uuidv4(),
        name,
        subject,
        email,
        message
      }
    });

    const notificationMessage = `You have an enquiry from ${name}`;
    await createNotification({
      subject: 'New Contact Enquiry',
      message: notificationMessage
    });

   
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: contact
    });

  } catch (error) {
    console.error("Error saving contact enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your enquiry"
    });
  }
};


//admin


export const getAllEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'read' or 'unread'
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const skip = (page - 1) * limit;

    // Build filter conditions
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    const totalEnquiryCount = await prisma.enquiries.count();
    // Get total count for pagination
    const totalCount = await prisma.enquiries.count({
      where: whereClause,
    });

    // Get paginated results
    const enquiries = await prisma.enquiries.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      totalEnquiryCount:totalEnquiryCount,
      enquiries,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enquiries"
    });
  }
};

export const getEnquirybyId = async (req, res) => {
  const { id } = req.params;
  try {
    const enquiry = await prisma.enquiries.findUnique({
      where: { id: id }
    });
    return res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      enquiry: enquiry
    });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enquiry"
    });
  }

}


export const updateEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEnquiry = await prisma.enquiries.update({
      where: { id },
      data: { status: 'read' },
    });
    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry: updatedEnquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating enquiry",
    });
  }
}

export const deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEnquiry = await prisma.enquiries.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      enquiry: deletedEnquiry,
    });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting enquiry",
    });
  }
}



export const exportEnquiries = async (req, res) => {
  try {
    const { status, startDate, endDate, format: fileFormat } = req.query;

    // Build query filters
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (startDate) {
      filters.createdAt = { ...filters.createdAt, gte: new Date(startDate) };
    }

    if (endDate) {
      filters.createdAt = { ...filters.createdAt, lte: new Date(endDate) };
    }

    // Fetch enquiries with filters applied
    const enquiries = await prisma.enquiries.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });

    if (fileFormat === 'excel') {
      // Export as Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Enquiries');

      worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        // { header: 'Phone Number', key: 'phoneNumber', width: 15 },
        { header: 'Message', key: 'message', width: 40 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Date', key: 'createdAt', width: 20 },
      ];

      enquiries.forEach((enquiry) => {
        worksheet.addRow({
          name: enquiry.name,
          email: enquiry.email,
          // phoneNumber: enquiry.phoneNumber,
          message: enquiry.message,
          status: enquiry.status,
          createdAt: format(new Date(enquiry.createdAt), 'dd MMM yyyy'),
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=enquiries.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else if (fileFormat === 'pdf') {
      // Generate PDF
      const pdfBuffer = await generatePdfReport(enquiries, startDate, endDate);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=enquiries.pdf');
      res.send(pdfBuffer);
    } else {
      res.status(400).json({ error: 'Invalid format specified' });
    }
  } catch (error) {
    console.error('Error exporting enquiries:', error);
    res.status(500).json({ error: 'Failed to export enquiries' });
  }
};

// Function to generate PDF report with structured table
async function generatePdfReport(enquiries, startDate, endDate) {
  return new Promise((resolve, reject) => {
    // Define margins for left and right (e.g., 30)
    const marginLeftRight = 30;
    const marginTopBottom = 50; // Keep top/bottom margin the same
    const pageWidth = 595.28;  // A4 width in points (default size for A4 page)
    const pageHeight = 841.89; // A4 height in points (default size for A4 page)

    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4' });
    const buffers = [];

    // Collect buffer data
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // Set the starting point after the left margin
    const contentStartX = marginLeftRight;
    const contentWidth = pageWidth - 2 * marginLeftRight; // Width after subtracting left and right margins

    // PDF Title
    const dateRangeText = startDate && endDate 
      ? `From ${format(new Date(startDate), 'dd MMM yyyy')} to ${format(new Date(endDate), 'dd MMM yyyy')}` 
      : 'Total';
    
    doc.fontSize(16).font('Helvetica-Bold').text(`Enquiries Report - ${dateRangeText}`, { align: 'center' });
    doc.moveDown();

    // Table configuration
    const tableTop = doc.y;
    const headers = [
      'S.No.', 'Name', 'Email', 'Message', 
      'Status', 'Date'
    ];
    const columnWidths = [40, 80, 100, 120, 50, 70];
    
    // Function to draw table cell
    function drawCell(text, x, y, width, rowHeight, isHeader = false) {
      // Draw cell border
      doc.lineWidth(0.5)
         .rect(x, y, width, rowHeight)
         .stroke();

      // Add text
      doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(10)
         .text(text || '', x + 5, y + 5, { 
           width: width - 10, 
           align: 'left' 
         });
    }

    // Function to calculate the height based on content
    function getRowHeight(text, width) {
      return doc.heightOfString(text, { width: width - 10, align: 'left' }) + 10;
    }

    // Draw table headers
    let currentX = contentStartX;
    headers.forEach((header, index) => {
      drawCell(header, currentX, tableTop, columnWidths[index], 20, true); 
      currentX += columnWidths[index];
    });

    // Draw table rows with serial numbers
    let currentY = tableTop + 20; // Start after header
    enquiries.forEach((enquiry, index) => {
      currentX = contentStartX;
      
      // Prepare row data with serial number
      const rowData = [
        (index + 1).toString(), // Serial number
        enquiry.name,
        enquiry.email,
        // enquiry.phoneNumber,
        enquiry.message,
        enquiry.status,
        format(new Date(enquiry.createdAt), 'dd MMM yyyy'),
      ];

      // Calculate the height for the row based on the longest text
      let rowHeight = 20;
      rowData.forEach((cellContent, index) => {
        const cellHeight = getRowHeight(cellContent, columnWidths[index]);
        rowHeight = Math.max(rowHeight, cellHeight); // Choose the tallest height
      });

      // Draw cells for this row
      rowData.forEach((cellContent, index) => {
        drawCell(cellContent, currentX, currentY, columnWidths[index], rowHeight);
        currentX += columnWidths[index];
      });

      currentY += rowHeight;

      // Add page break if needed
      if (currentY > doc.page.height - 100) {
        doc.addPage();
        currentY = 50;
      }
    });

    // Finalize PDF
    doc.end();
  });
}

