import { memoryStore, supabase } from '../config/database.js';
import { AuditService } from './audit.service.js';

export class CommsService {
  /**
   * Posts an announcement (Admin / HR)
   */
  static async postAnnouncement({ title, content, priority = 'normal', department = null }, currentUser) {
    const announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      department: department || null,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: currentUser.role,
      created_at: new Date().toISOString()
    };

    memoryStore.announcements.unshift(announcement);

    if (supabase) {
      try {
        await supabase.from('announcements').insert([announcement]);
      } catch (err) {
        console.warn('[CommsService] Supabase announcement sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'POST_ANNOUNCEMENT',
      entityType: 'ANNOUNCEMENT',
      entityId: announcement.id,
      afterState: announcement
    });

    return announcement;
  }

  /**
   * Retrieves announcements (All roles)
   */
  static async getAnnouncements(department = null) {
    let list = [...memoryStore.announcements];
    if (department && department !== 'all') {
      list = list.filter(a => !a.department || a.department.toLowerCase() === department.toLowerCase());
    }
    return list;
  }

  /**
   * In-app notifications
   */
  static async createNotification({ recipientId, title, message, type = 'info', link = null }) {
    const notification = {
      id: `notif-${Date.now()}`,
      recipient_id: recipientId,
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString()
    };

    memoryStore.notifications.unshift(notification);
    return notification;
  }

  static async getNotifications(userId) {
    return memoryStore.notifications.filter(n => n.recipient_id === userId);
  }

  static async markNotificationRead(notificationId, userId) {
    const notif = memoryStore.notifications.find(n => n.id === notificationId && n.recipient_id === userId);
    if (notif) {
      notif.is_read = true;
    }
    return notif;
  }
}
