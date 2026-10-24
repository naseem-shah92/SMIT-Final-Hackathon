import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async createHR(req, res, next) {
    try {
      const hrUser = await AuthService.createHR(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'HR account created successfully',
        user: hrUser
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await AuthService.toggleUserStatus(userId, req.user);
      return res.status(200).json({
        success: true,
        message: `User status updated to ${result.status}`,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const result = await AuthService.changePassword(req.user.id, req.body);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (err) {
      next(err);
    }
  }
}
