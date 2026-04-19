import express from 'express';
import { handleGitHubWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Webhook endpoints don't require authentication
router.post('/github', express.raw({ type: 'application/json' }), handleGitHubWebhook);

export default router;
