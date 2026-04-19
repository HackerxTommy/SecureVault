import express from 'express';
import {
  analyzeRepository,
  analyzeCodeQuality,
  scanDependencies
} from '../controllers/codeAnalysis.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/analyze', analyzeRepository);
router.get('/quality/:repoUrl(*)', analyzeCodeQuality);
router.get('/dependencies/:repoUrl(*)', scanDependencies);

export default router;
