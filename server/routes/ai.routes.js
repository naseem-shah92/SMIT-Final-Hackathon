import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { aiRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

// Chat panel with tool calling and security guardrails
router.post('/chat', authenticate, aiRateLimiter, AIController.chat);

// Dashboard KPI summary generator
router.post('/summarize', authenticate, authorize('admin', 'hr'), aiRateLimiter, AIController.summarize);

// Smart leave natural language parser (English & Roman Urdu)
router.post('/smart-leave', authenticate, aiRateLimiter, AIController.smartLeave);

export default router;
