/**
 * Notifications API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '../services';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const notifications = await NotificationService.getNotifications(userId);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { notificationId } = await req.json();

    if (notificationId) {
      await NotificationService.markAsRead(notificationId);
    } else {
      await NotificationService.markAllAsRead(userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark as read error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

