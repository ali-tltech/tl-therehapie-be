import prisma from "../helpers/prisma.js";
import { sendEmail, testEmailTemplate } from "../helpers/email.js";



export const upsertEmailConfig = async (req, res) => {
  const { host, port, secure, authUser, authPass } = req.body;
  
  try {
    const existingConfig = await prisma.emailConfig.findFirst();
    
    // If no config exists, create a new one
    if (!existingConfig) {
      const emailConfig = await prisma.emailConfig.create({
        data: {
          host,
          port,
          secure,
          authUser,
          authPass,
        },
      });
      return res.status(200).json(emailConfig);
    }
    
    // If config exists, update it
    const emailConfig = await prisma.emailConfig.update({
      where: { id: existingConfig.id },
      data: {
        host,
        port,
        secure,
        authUser,
        authPass,
      },
    });

    res.status(200).json(emailConfig);
  } catch (error) {
    console.error('Error upserting EmailConfig:', error);
    res.status(500).json({ error: 'Error upserting EmailConfig', message: error.message });
  }
};


export const getEmailConfiguration = async (req, res) => {
  try {
    const emailConfig = await prisma.emailConfig.findFirst();

    if (!emailConfig) {
      return res.status(404).json({ error: 'No email configuration found' });
    }

    res.status(200).json(emailConfig);
  } catch (error) {
    console.error('Error fetching email config:', error);
    res.status(500).json({ error: 'Error fetching EmailConfig', message: error.message });
  }
};


  export const getEmailConfig = async () => {
    try {
      const emailConfig = await prisma.emailConfig.findFirst();
      
      if (!emailConfig) {
        throw new Error('No email configuration found in the database');
      }
         
      return emailConfig;
    } catch (error) {
      console.error('Error fetching email config from database:', error);
      throw new Error('Could not fetch email configuration');
    }
  };

  export const sendTestEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const subject = 'Test Email';
      const html = testEmailTemplate()
  
      const emailSent = await sendEmail({
        to: email,
        subject,
        html
      });
  
      if (emailSent) {
        return res.status(200).json({ message: 'Test email sent successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to send test email' });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      return res.status(500).json({ message: 'Error sending test email', error: error.message });
    }
  };