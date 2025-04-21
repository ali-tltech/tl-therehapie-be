import * as argon2 from "argon2";
import generateJwtToken from "../utils/generateJwtToken.js";
import prisma from "../helpers/prisma.js";

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