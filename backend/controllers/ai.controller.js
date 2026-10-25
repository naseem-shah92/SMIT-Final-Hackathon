import { AIService } from '../services/ai.service.js';

export class AIController {
  static async chat(req, res, next) {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'A message string is required.' });
      }
      const response = await AIService.chat({ message, history }, req.user);
      return res.status(200).json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  }

  static async summarize(req, res, next) {
    try {
      const { kpis } = req.body;
      if (!kpis) {
        return res.status(400).json({ success: false, error: 'kpis payload is required.' });
      }
      const response = await AIService.summarizeKPIs(kpis, req.user);
      return res.status(200).json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  }

  static async smartLeave(req, res, next) {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ success: false, error: 'Free-form text prompt is required.' });
      }
      const parsed = await AIService.parseSmartLeave(text, req.user);
      return res.status(200).json({ success: true, ...parsed });
    } catch (err) {
      next(err);
    }
  }
}
