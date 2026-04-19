import express from 'express';
import {
  runRecon,
  enumerateSubdomains,
  detectTechnologies,
  runDockerRecon
} from '../controllers/recon.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/run', runRecon);
router.post('/docker', runDockerRecon);
router.get('/subdomains/:domain', enumerateSubdomains);
router.get('/technologies/:url(*)', detectTechnologies);

export default router;
