import prisma from "../helpers/prisma.js";
import { createNotification } from '../helpers/createNotification.js';



export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 15 
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};


export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        isRead: false
      },
      data: {
        isRead: true
      }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
}


export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({
      where: {
        id : id
      }
    });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
}

export const clearAllNotifications = async (req, res) => {
  try {
    await prisma.notification.deleteMany({});
    res.json({ message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
}
















export const triggerNotification = async (req, res) => {
  try {
    const { subject, message } = req.body;
    await createNotification({
      subject,
      message
    });
    res.json({ message: 'Notification triggered successfully' });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({ message: 'Error triggering notification' });
  }
};