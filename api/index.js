import app from '../backend/app.js';
import { AuthService } from '../backend/services/auth.service.js';

let isInit = false;

export default async function handler(req, res) {
  if (!isInit) {
    try {
      await AuthService.initBaselineAccounts();
    } catch (err) {
      console.warn('[Vercel Serverless] Account initialization warning:', err.message);
    }
    isInit = true;
  }
  return app(req, res);
}
