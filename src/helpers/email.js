import nodemailer from 'nodemailer';
import { getEmailConfig } from '../controller/emailConfigController.js';

const createTransporter = async () => {
    const emailConfig = await getEmailConfig();
  
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,        // Host from DB
      port: emailConfig.port,        // Port from DB
      secure: emailConfig.secure,    // Secure from DB
      auth: {
        user: emailConfig.authUser,  // Auth user from DB
        pass: emailConfig.authPass   // Auth pass from DB
      }
    });
    return transporter;
}



export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = await createTransporter();
        const emailConfig = await getEmailConfig();
        const mailOptions = {
            from: emailConfig.authUser,
            to, 
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Email templates
export const emailTemplates = {
    passwordChange: (userName) => {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0; padding: 20px 0; border-bottom: 2px solid #eee;">Password Change Notification</h2>
        </div>
        
        <div style="padding: 20px; color: #555; line-height: 1.5;">
            <p style="font-size: 16px;">Hello ${userName},</p>
            
            <p style="font-size: 16px;">Your password has been successfully changed. This email is to confirm that this change was made to your account.</p>
            
            <div style="background-color: #e8f0fe; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                <div style="font-size: 24px; font-weight: bold; color: #1a73e8;">
                    Password Successfully Changed
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">If this wasn't you, please contact support immediately</p>
            </div>

            <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #e65100; margin: 0; font-size: 14px;">
                    <strong>Security Tips:</strong>
                </p>
                <ul style="color: #795548; font-size: 14px; margin: 10px 0;">
                    <li>Keep your password secure and never share it with others</li>
                    <li>Use a unique password for each of your accounts</li>
                </ul>
            </div>

            <p style="color: #666; font-size: 14px;">If you did not make this change, please contact our support team immediately.</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0;">Best regards,<br> theREHApie Team</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                    This is an automated message, please do not reply directly to this email.
                </p>
            </div>
        </div>
    </div>
        `;
    },
    sendOTP: (userName, otp) => {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333; margin: 0; padding: 20px 0; border-bottom: 2px solid #eee;">Password Reset OTP</h2>
                </div>
                
                <div style="padding: 20px; color: #555; line-height: 1.5;">
                    <p style="font-size: 16px;">Hello ${userName},</p>
                    
                    <p style="font-size: 16px;">You have requested to reset your password. Please use the following OTP to continue with the password reset process:</p>
                    
                    <div style="background-color: #e8f0fe; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 5px;">
                            ${otp}
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">This OTP is valid for 5 minutes</p>
                    </div>

                    <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #e65100; margin: 0; font-size: 14px;">
                            <strong>Security Tips:</strong>
                        </p>
                        <ul style="color: #795548; font-size: 14px; margin: 10px 0;">
                            <li>Never share your OTP with anyone</li>
                    </div>

                    <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #888; font-size: 14px; margin: 0;">Best regards,<br>theREHApie Team</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="color: #888; font-size: 12px; margin: 0;">
                            This is an automated message, please do not reply directly to this email.<br>
                            If you need assistance, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },
    passwordResetSuccess: (userName) => {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333; margin: 0; padding: 20px 0; border-bottom: 2px solid #eee;">Password Reset Successful</h2>
                </div>
                
                <div style="padding: 20px; color: #555; line-height: 1.5;">
                    <p style="font-size: 16px;">Hello ${userName},</p>
                    
                    <p style="font-size: 16px;">Your password has been successfully reset. You can now use your new password to log in to your account.</p>
                    
                    <div style="background-color: #e8f0fe; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 24px; font-weight: bold; color: #1a73e8;">
                            Password Reset Complete
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">You can now login with your new password</p>
                    </div>

                    <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #e65100; margin: 0; font-size: 14px;">
                            <strong>Security Tips:</strong>
                        </p>
                        <ul style="color: #795548; font-size: 14px; margin: 10px 0;">
                            <li>Keep your new password secure and never share it</li>
                            <li>Use a unique password for each of your accounts</li>
                        </ul>
                    </div>

                    <p style="color: #666; font-size: 14px;">If you did not reset your password, please contact our support team immediately.</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #888; font-size: 14px; margin: 0;">Best regards,<br>theREHApie Team</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="color: #888; font-size: 12px; margin: 0;">
                            This is an automated message, please do not reply directly to this email.<br>
                            If you need assistance, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },


}


export const testEmailTemplate = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Test Email</h2>
        <p style="color: #555;">This is a test email to check your email configuration. If you see this message, your email setup is working fine.</p>
      </div>
    `;
  };


// Newsletter template
export const newsletterTemplate = (content, unsubscribeUrl, subject) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0; padding: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px; border-bottom: 3px solid #3498db;">${subject}</h2>
            </div>
            
            <div style="padding: 20px; color: #555; line-height: 1.7; font-size: 16px;">
                ${content}
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #888; font-size: 14px; margin: 0;">Best regards,<br>theREHApie Team</p>
                
                <!-- 
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #888; font-size: 12px; margin: 0;">
                        If you no longer wish to receive our newsletter, 
                        <a href="${unsubscribeUrl}" style="color: #3498db; text-decoration: none; font-weight: bold; cursor: pointer;">click here to unsubscribe</a>
                    </p>
                </div>
                -->
            </div>
        </div>
    `;
};

// Send newsletter to a single recipient
export const sendNewsletterEmail = async ({ to, subject, content , unsubscribeUrl }) => {
    try {
        const transporter = await createTransporter();
         const emailConfig = await getEmailConfig();
        const mailOptions = {
            from: emailConfig.authUser,
            to,
            subject,
            html: newsletterTemplate(content ,unsubscribeUrl ,subject)
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending newsletter:', error);
        throw error;
    }
};