import express from 'express';
import {
  createScan,
  getScan,
  listScans,
  cancelScan,
  getScanFindings,
  runDockerScan
} from '../controllers/scan.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateScanCreate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validateScanCreate, createScan);
router.get('/', listScans);
router.get('/:scanId', getScan);
router.patch('/:scanId/cancel', cancelScan);
router.get('/:scanId/findings', getScanFindings);
router.post('/docker', runDockerScan);

export default router;
