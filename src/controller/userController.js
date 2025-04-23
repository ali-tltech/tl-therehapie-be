import prisma from "../helpers/prisma.js";
import * as argon2 from "argon2";
import { UserRolesType } from "../types/userTypes.js";



export const createUser = async (req, res) => {
    console.log(req.body)
    const { name, email, password, confirmPassword, role } = req.body;
    // Ensure all fields are provided
    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    if (![UserRolesType.ADMIN, UserRolesType.SUPER_ADMIN].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExists) {
            return res.status(400).json({ message: "There is already an account with this email" });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role, 
            },
        });
        return res.status(201).json({
            message: 'User created successfully',
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(500).json({
            message: 'Something went wrong while creating the user', success: false
        });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            message: 'Something went wrong while fetching users', success: false
        });
    }
}



export const updateUser = async (req, res) => {
    const { id } = req.params;  // User ID from URL
    const { name, email, role } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !role) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }

    if (![UserRolesType.ADMIN, UserRolesType.SUPER_ADMIN].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                role,
            },
        });

        return res.status(200).json({
            message: 'User updated successfully',
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            },
        });
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({
            message: 'Something went wrong while updating the user',
            success: false
        });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;  // User ID from URL

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await prisma.user.delete({
            where: {
                id
            },
        });

        return res.status(200).json({
            message: 'User deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error during user deletion:', error);
        return res.status(500).json({
            message: 'Something went wrong while deleting the user',
            success: false
        });
    }
}



export const getProfile = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id, 
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Controller to update user profile
  export const updateProfile = async (req, res) => {
    const { name } = req.body; 
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
  
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name, // Only update the name
        },
      });
  
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          name: updatedUser.name,
        },
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };