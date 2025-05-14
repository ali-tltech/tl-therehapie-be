import express from 'express';
import { clearAllNotifications, deleteNotification, getNotifications, markAllAsRead, markAsRead, triggerNotification } from '../../controller/notification.controller.js';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';



const router = express.Router();

router.get('/get-all-notifications',verifyJwtToken, getNotifications);
router.put('/mark-as-read/:id', verifyJwtToken,markAsRead);
router.put('/mark-all-as-read',verifyJwtToken,markAllAsRead)
router.delete('/delete/:id',verifyJwtToken,deleteNotification)
router.delete('/clear-all-notifications',verifyJwtToken, clearAllNotifications);




//testing api
router.post('/trigger-notification', triggerNotification);

export default router;