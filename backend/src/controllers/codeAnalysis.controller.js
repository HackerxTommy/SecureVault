import codeAnalysisService from '../services/codeAnalysis.service.js';

export const analyzeRepository = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    const results = await codeAnalysisService.scanGitHubRepo(repoUrl);

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const analyzeCodeQuality = async (req, res) => {
  try {
    const { repoUrl } = req.params;

    const metrics = await codeAnalysisService.analyzeCodeQuality(repoUrl);

    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const scanDependencies = async (req, res) => {
  try {
    const { repoUrl } = req.params;

    const vulnerabilities = await codeAnalysisService.scanDependencies(
      repoUrl.split('/')[3],
      repoUrl.split('/')[4]
    );

    res.json({
      success: true,
      vulnerabilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  analyzeRepository,
  analyzeCodeQuality,
  scanDependencies
};
