/**
 * Notification domain model
 */

import type { Notification } from '../types';
import { formatNotificationTime, getNotificationIcon } from '../utils';

export class NotificationModel {
  constructor(private notification: Notification) {}

  get id(): string {
    return this.notification.id;
  }

  get title(): string {
    return this.notification.title;
  }

  get message(): string {
    return this.notification.message;
  }

  isRead(): boolean {
    return this.notification.read;
  }

  getIcon(): string {
    return getNotificationIcon(this.notification.type);
  }

  getTimeAgo(): string {
    return formatNotificationTime(this.notification.createdAt);
  }

  hasAction(): boolean {
    return !!this.notification.actionUrl;
  }

  toJSON(): Notification {
    return this.notification;
  }
}

