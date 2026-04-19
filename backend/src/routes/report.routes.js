import express from 'express';
import {
  generateReport,
  listReports,
  getReport
} from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/generate', generateReport);
router.get('/', listReports);
router.get('/:reportId', getReport);

export default router;
