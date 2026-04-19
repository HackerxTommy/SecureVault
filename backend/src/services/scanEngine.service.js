import Scan from '../models/Scan.js';
import scanQueue from './scanQueue.service.js';

export const createScan = async (userId, targetUrl, targetType, scanMode = 'standard') => {
  const scan = await Scan.create({
    userId,
    targetUrl,
    targetType,
    scanMode,
    status: 'pending',
    progress: 0
  });

  await scanQueue.add({
    scanId: scan._id.toString(),
    targetUrl,
    targetType,
    scanMode
  });

  return scan;
};

export const getScanById = async (scanId, userId) => {
  return await Scan.findOne({ _id: scanId, userId });
};

export const getUserScans = async (userId, limit = 20, skip = 0) => {
  return await Scan.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

export const cancelScan = async (scanId, userId) => {
  const scan = await Scan.findOne({ _id: scanId, userId });
  
  if (!scan) {
    throw new Error('Scan not found');
  }

  if (scan.status === 'completed' || scan.status === 'failed') {
    throw new Error('Cannot cancel completed or failed scan');
  }

  const jobs = await scanQueue.getJobs(['waiting', 'active']);
  const job = jobs.find(j => j.data.scanId === scanId);
  if (job) {
    await job.remove();
  }

  await Scan.findByIdAndUpdate(scanId, {
    status: 'cancelled',
    completedAt: new Date()
  });

  return { success: true };
};

export default {
  createScan,
  getScanById,
  getUserScans,
  cancelScan
};
