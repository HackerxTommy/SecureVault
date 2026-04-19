import Scan from '../models/Scan.js';
import Finding from '../models/Finding.js';

export const getUserAnalytics = async (userId) => {
  const scans = await Scan.find({ userId });
  const allFindings = await Finding.find({
    scanId: { $in: scans.map(s => s._id) }
  });

  // Calculate stats
  const totalScans = scans.length;
  const completedScans = scans.filter(s => s.status === 'completed').length;
  const failedScans = scans.filter(s => s.status === 'failed').length;
  const totalFindings = allFindings.length;

  // Severity breakdown
  const severityBreakdown = {
    critical: allFindings.filter(f => f.severity === 'critical').length,
    high: allFindings.filter(f => f.severity === 'high').length,
    medium: allFindings.filter(f => f.severity === 'medium').length,
    low: allFindings.filter(f => f.severity === 'low').length,
    info: allFindings.filter(f => f.severity === 'info').length
  };

  // Scans by target type
  const byTargetType = {};
  for (const scan of scans) {
    if (!byTargetType[scan.targetType]) {
      byTargetType[scan.targetType] = 0;
    }
    byTargetType[scan.targetType]++;
  }

  // Average scan duration
  const completedWithDuration = scans.filter(s => s.duration);
  const avgDuration = completedWithDuration.length > 0
    ? completedWithDuration.reduce((sum, s) => sum + s.duration, 0) / completedWithDuration.length
    : 0;

  // Trend data (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentScans = scans.filter(s => s.createdAt > thirtyDaysAgo);

  return {
    summary: {
      totalScans,
      completedScans,
      failedScans,
      totalFindings,
      criticalIssues: severityBreakdown.critical,
      highIssues: severityBreakdown.high,
      avgScanDuration: Math.round(avgDuration)
    },
    severity: severityBreakdown,
    byTargetType,
    recentActivity: recentScans.length,
    topVulnerabilityTypes: getTopVulnerabilityTypes(allFindings),
    riskTrend: calculateRiskTrend(scans),
    scans: scans
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(s => ({
        id: s._id,
        target: s.targetUrl,
        type: s.targetType,
        status: s.status,
        findings: allFindings.filter(f => f.scanId.toString() === s._id.toString()).length,
        date: s.createdAt
      }))
  };
};

function getTopVulnerabilityTypes(findings) {
  const types = {};
  for (const finding of findings) {
    if (!types[finding.type]) {
      types[finding.type] = 0;
    }
    types[finding.type]++;
  }

  return Object.entries(types)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
}

function calculateRiskTrend(scans) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentScans = scans.filter(s => s.createdAt > thirtyDaysAgo);

  if (recentScans.length < 2) {
    return { trend: 'stable', direction: 'none' };
  }

  const firstHalf = recentScans.slice(0, Math.floor(recentScans.length / 2));
  const secondHalf = recentScans.slice(Math.floor(recentScans.length / 2));

  const firstAvg = firstHalf.reduce((sum, s) => sum + (s.statistics?.totalFindings || 0), 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, s) => sum + (s.statistics?.totalFindings || 0), 0) / secondHalf.length;

  if (secondAvg > firstAvg * 1.2) {
    return { trend: 'increasing', direction: 'up', percentage: Math.round((secondAvg - firstAvg) / firstAvg * 100) };
  } else if (secondAvg < firstAvg * 0.8) {
    return { trend: 'decreasing', direction: 'down', percentage: Math.round((firstAvg - secondAvg) / firstAvg * 100) };
  }

  return { trend: 'stable', direction: 'none' };
}

export default {
  getUserAnalytics
};
