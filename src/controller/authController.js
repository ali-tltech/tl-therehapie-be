import * as argon2 from "argon2";
import generateJwtToken from "../utils/generateJwtToken.js";
import prisma from "../helpers/prisma.js";
import generateOTP from "../utils/generateOtp.js";
import { emailTemplates, sendEmail } from "../helpers/email.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    // Ensure all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }

    try {
        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password matches
        const isPasswordCorrect = await argon2.verify(user.password, password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate a JWT token for the user
        const token = generateJwtToken(user);

        if (!token) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        // Respond with the JWT token and user details
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
        // If the user is not found or the password is incorrect, return an error
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(503).json({ message: 'Something went wrong while logging in', success: false });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive a reset code'
            });
        }

        const otp = generateOTP();

        const existingOTP = await prisma.otp.findUnique({
            where: {
                email: email,
            },
        });

        if (existingOTP) {
            await prisma.otp.update({
                where: {
                    email: email,
                },
                data: {
                    otp: otp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    isVerified: false

                },
            });
        } else {
            await prisma.otp.create({
                data: {
                    email: email,
                    otp: otp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    isVerified: false
                },
            });
        }
        const message = `Your OTP is ${otp}. Please enter it to reset your password.`;
       

        await sendEmail({
            to: email,
            subject: "Password Reset OTP - AshFlix",
            html: emailTemplates.sendOTP(user.name, otp)
        });


        // Respond with success message
        res.status(200).json({
            message: 'OTP sent successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error during password change:', error);
        return res.status(500).json({ message: 'Something went wrong while sending OTP', success: false });

    }
}
// todo
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    // Ensure all fields are provided
    if (!email || !otp) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }

    try {


        // Check if OTP exists for this email
        const existingOTP = await prisma.otp.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingOTP) {
            return res.status(400).json({ message: "No OTP found for this email", success: false });
        }

        // Check if OTP is verified
        if (existingOTP.isVerified === true) {
            return res.status(400).json({ message: "OTP has expired", success: false });
        }
        // Check if OTP is expired
        if (existingOTP.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP has expired", success: false });
        }

        // Check if OTP matches
        if (existingOTP.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }

        await prisma.otp.update({
            where: {
                email: email,
            },
            data: {
                isVerified: true
            },
        });

        return res.status(200).json({
            message: "OTP verified successfully, you can now reset your password",
            success: true,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Something went wrong while verifying OTP", success: false });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;

    try {

        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                message: "Please provide all the required fields",
                success: false,
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long", success: false });
        }

        // Ensure passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: "New passwords do not match",
                success: false,
            });
        }
        const isOtpVerified = await prisma.otp.findUnique({
            where: {
                email: email,
                isVerified: true
            },
        });

        if (!isOtpVerified) {
            return res.status(400).json({
                message: "Please verify your OTP first",
                success: false,
            });
        }


        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "There is no account related to this email", success: false });
        }

        // Update the password
        const hashedPassword = await argon2.hash(newPassword);
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            },
        });

        await prisma.otp.deleteMany({
            where: {
                email: email,
            },
        });

        res.status(200).json({
            message: 'Password reset successfully',
            success: true,
        });
        sendEmail({
            to: user.email,
            subject: "Password Reset Successful",
            html: emailTemplates.passwordResetSuccess(user.name)
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ message: 'Something went wrong while resetting password', success: false });
    }
};