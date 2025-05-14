import prisma from "../helpers/prisma.js";
import { io } from '../socket/socket.js';
import { v4 as uuidv4 } from 'uuid';




export const createNotification = async ({ subject, message }) => {
  try {
    // Save the notification in the database
    const notification = await prisma.notification.create({
      data: {
        id: uuidv4(),
        subject,
        message
      },
    });

    // Emit the notification to all connected clients
    io.emit('new-notification', notification);

  } catch (error) {
    console.error('Error creating notification:', error);
  } finally {
    // Optionally disconnect the Prisma client if no other operations are ongoing
    await prisma.$disconnect();
  }
};