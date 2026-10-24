import { CommsService } from '../services/comms.service.js';

export class CommsController {
  static async postAnnouncement(req, res, next) {
    try {
      const announcement = await CommsService.postAnnouncement(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Announcement broadcasted',
        announcement
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAnnouncements(req, res, next) {
    try {
      const announcements = await CommsService.getAnnouncements(req.query.department);
      return res.status(200).json({ success: true, announcements });
    } catch (err) {
      next(err);
    }
  }

  static async getNotifications(req, res, next) {
    try {
      const notifications = await CommsService.getNotifications(req.user.id);
      return res.status(200).json({ success: true, notifications });
    } catch (err) {
      next(err);
    }
  }

  static async markNotificationRead(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await CommsService.markNotificationRead(id, req.user.id);
      return res.status(200).json({ success: true, notification: updated });
    } catch (err) {
      next(err);
    }
  }
}
