import reconService from '../services/recon.service.js';
import dockerReconService from '../services/dockerRecon.service.js';

export const runRecon = async (req, res) => {
  try {
    const { targetUrl, targetType, useDocker = true } = req.body;
    const scanId = req.scanId;

    if (!targetUrl) {
      return res.status(400).json({ success: false, message: 'Target URL is required' });
    }

    let results;
    
    if (useDocker) {
      // Use cloud-based reconnaissance API
      results = await dockerReconService.runRecon(targetUrl, {
        phase: 'all'
      });
    } else {
      // Use in-memory reconnaissance service
      results = await reconService.runReconaissance(scanId, targetUrl, targetType);
    }
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('Recon error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enumerateSubdomains = async (req, res) => {
  try {
    const { domain } = req.params;

    // Use cloud API for subdomain enumeration
    const results = await dockerReconService.runRecon(domain, {
      phase: 'subdomains'
    });
    
    res.json({ success: true, subdomains: results.subdomains || [] });
  } catch (error) {
    console.error('Subdomain enumeration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const detectTechnologies = async (req, res) => {
  try {
    const { url } = req.params;

    const technologies = await reconService.detectTechnologies(url);
    
    res.json({ success: true, technologies });
  } catch (error) {
    console.error('Technology detection error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runDockerRecon = async (req, res) => {
  try {
    const { target, phase = 'all' } = req.body;

    if (!target) {
      return res.status(400).json({ success: false, message: 'Target is required' });
    }

    const isRunning = await dockerReconService.isEngineRunning();
    if (!isRunning) {
      await dockerReconService.startEngine();
    }
    
    const results = await dockerReconService.runRecon(target, { phase });
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('Docker recon error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  runRecon,
  enumerateSubdomains,
  detectTechnologies,
  runDockerRecon
};
