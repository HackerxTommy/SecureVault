import scanService from '../services/scanEngine.service.js';
import dockerReconService from '../services/dockerRecon.service.js';
import Scan from '../models/Scan.js';
import Finding from '../models/Finding.js';

export const createScan = async (req, res) => {
  try {
    const { targetUrl, targetType, scanMode } = req.body;
    const userId = req.user._id;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Target URL is required'
      });
    }

    const scan = await scanService.createScan(userId, targetUrl, targetType || 'web', scanMode || 'standard');

    res.status(201).json({
      success: true,
      scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getScan = async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user._id;

    const scan = await scanService.getScanById(scanId, userId);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const listScans = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const scans = await scanService.getUserScans(userId, limit, skip);
    const total = await Scan.countDocuments({ userId });

    res.json({
      success: true,
      scans,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + scans.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const cancelScan = async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user._id;

    await scanService.cancelScan(scanId, userId);

    res.json({
      success: true,
      message: 'Scan cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getScanFindings = async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user._id;

    const scan = await Scan.findOne({ _id: scanId, userId });
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    const findings = await Finding.find({ scanId })
      .sort({ severity: 1, createdAt: -1 });

    res.json({
      success: true,
      findings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const runDockerScan = async (req, res) => {
  try {
    const { target, phase = 'all' } = req.body;
    const userId = req.user._id;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Target is required'
      });
    }

    // Run cloud reconnaissance API
    const response = await dockerReconService.runRecon(target, { phase });
    const results = response.results || response;

    // Create scan record
    const scan = await Scan.create({
      userId,
      targetUrl: target,
      targetType: 'web',
      scanMode: phase === 'all' ? 'full' : phase,
      status: 'completed',
      progress: 100,
      findings: [],
      statistics: {
        totalFindings: results.vulnerabilities?.length || 0,
        criticalCount: results.vulnerabilities?.filter(v => v.severity === 'critical')?.length || 0,
        highCount: results.vulnerabilities?.filter(v => v.severity === 'high')?.length || 0,
        mediumCount: results.vulnerabilities?.filter(v => v.severity === 'medium')?.length || 0,
        lowCount: results.vulnerabilities?.filter(v => v.severity === 'low')?.length || 0
      },
      duration: 0,
      dockerResults: results
    });

    res.json({
      success: true,
      scan,
      results
    });
  } catch (error) {
    console.error('Cloud scan error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
