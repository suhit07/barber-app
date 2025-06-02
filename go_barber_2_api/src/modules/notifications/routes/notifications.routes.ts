import { Router } from 'express';
import { Notification } from '../schemas/NotificationSchema';

const notificationsRouter = Router();

// List notifications
notificationsRouter.get('/', async (request, response) => {
  const user_id = request.user.id;

  const notifications = await Notification.find({
    recipient_id: user_id,
  }).sort({ created_at: -1 });

  return response.json(notifications);
});

// Mark notification as read
notificationsRouter.patch('/:id', async (request, response) => {
  const { id } = request.params;
  const user_id = request.user.id;

  const notification = await Notification.findById(id);

  if (!notification) {
    return response.status(404).json({ error: 'Notification not found' });
  }

  if (notification.recipient_id !== user_id) {
    return response.status(401).json({
      error: "You don't have permission to update this notification",
    });
  }

  notification.read = true;
  await notification.save();

  return response.json(notification);
});

export default notificationsRouter; 