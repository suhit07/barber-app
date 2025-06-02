import { Schema, model } from 'mongoose';

interface INotification {
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = model<INotification>('Notification', NotificationSchema); 