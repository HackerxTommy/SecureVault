import Scan from '../models/Scan.js';
import Finding from '../models/Finding.js';
import Report from '../models/Report.js';

// Generate executive summary
export const generateExecutiveSummary = async (scanId) => {
  const scan = await Scan.findById(scanId);
  const findings = await Finding.find({ scanId });

  const critical = findings.filter(f => f.severity === 'critical').length;
  const high = findings.filter(f => f.severity === 'high').length;

  let riskLevel = 'LOW';
  if (critical > 0) riskLevel = 'CRITICAL';
  else if (high > 0) riskLevel = 'HIGH';

  return {
    scanDate: scan.createdAt,
    targetUrl: scan.targetUrl,
    targetType: scan.targetType,
    scanDuration: scan.duration,
    riskLevel,
    totalFindings: findings.length,
    criticalFindings: critical,
    highFindings: high,
    summary: `This ${scan.targetType} security assessment identified ${findings.length} potential vulnerabilities. ` +
             `${critical} critical and ${high} high-severity issues require immediate attention. ` +
             `Risk level: ${riskLevel}` 
  };
};

// Generate findings summary for report
export const generateFindingsSummary = async (scanId) => {
  const findings = await Finding.find({ scanId })
    .sort({ severity: 1 });

  const grouped = {
    critical: findings.filter(f => f.severity === 'critical'),
    high: findings.filter(f => f.severity === 'high'),
    medium: findings.filter(f => f.severity === 'medium'),
    low: findings.filter(f => f.severity === 'low'),
    info: findings.filter(f => f.severity === 'info')
  };

  return {
    total: findings.length,
    grouped,
    byType: groupBy(findings, 'type'),
    riskScore: calculateRiskScore(grouped)
  };
};

// Calculate overall risk score
function calculateRiskScore(grouped) {
  const weights = { critical: 10, high: 7, medium: 4, low: 2, info: 0.5 };
  let score = 0;
  
  score += grouped.critical.length * weights.critical;
  score += grouped.high.length * weights.high;
  score += grouped.medium.length * weights.medium;
  score += grouped.low.length * weights.low;
  score += grouped.info.length * weights.info;

  // Normalize to 0-100
  const normalized = Math.min(100, (score / 100) * 100);
  return Math.round(normalized);
}

// Helper to group array by property
function groupBy(array, property) {
  return array.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
  }, {});
}

// Generate JSON report
export const generateJSONReport = async (scanId, userId) => {
  const scan = await Scan.findById(scanId);
  const findings = await Finding.find({ scanId });
  const summary = await generateFindingsSummary(scanId);
  const executive = await generateExecutiveSummary(scanId);

  const report = {
    metadata: {
      generatedAt: new Date(),
      version: '1.0',
      format: 'JSON'
    },
    scan: {
      id: scan._id,
      targetUrl: scan.targetUrl,
      targetType: scan.targetType,
      scanMode: scan.scanMode,
      startedAt: scan.startedAt,
      completedAt: scan.completedAt,
      duration: scan.duration
    },
    executiveSummary: executive,
    findingsSummary: summary,
    detailedFindings: findings.map(f => ({
      id: f._id,
      severity: f.severity,
      type: f.type,
      title: f.title,
      description: f.description,
      location: f.location,
      cvss: f.cvss,
      cwe: f.cwe,
      remediation: f.remediation,
      references: f.references
    })),
    compliance: {
      standards: ['OWASP Top 10', 'CWE/SANS Top 25'],
      mapping: getComplianceMapping(findings)
    }
  };

  const reportDoc = await Report.create({
    scanId,
    userId,
    format: 'json',
    title: `Security Report - ${scan.targetUrl}`,
    statistics: {
      totalFindings: findings.length,
      criticalCount: findings.filter(f => f.severity === 'critical').length,
      highCount: findings.filter(f => f.severity === 'high').length,
      mediumCount: findings.filter(f => f.severity === 'medium').length,
      lowCount: findings.filter(f => f.severity === 'low').length,
      infoCount: findings.filter(f => f.severity === 'info').length,
      scorePercentage: summary.riskScore
    },
    metadata: {
      executiveSummary: executive.summary,
      complianceStandards: ['OWASP Top 10', 'CWE/SANS Top 25']
    }
  });

  return { report, reportDoc };
};

// Generate HTML report
export const generateHTMLReport = async (scanId, userId) => {
  const scan = await Scan.findById(scanId);
  const findings = await Finding.find({ scanId });
  const summary = await generateFindingsSummary(scanId);
  const executive = await generateExecutiveSummary(scanId);

  const findingsHTML = findings.map(f => `
    <div class="finding">
      <h4>${f.title}</h4>
      <p><strong>Severity:</strong> <span class="severity-${f.severity}">${f.severity}</span></p>
      <p><strong>Type:</strong> ${f.type}</p>
      <p>${f.description}</p>
      ${f.remediation ? `<p><strong>Remediation:</strong> ${f.remediation}</p>` : ''}
      ${f.cwe ? `<p><strong>CWE:</strong> ${f.cwe.id} - ${f.cwe.name}</p>` : ''}
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Security Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; }
        .executive-summary { background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .findings { margin: 20px 0; }
        .finding { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .severity-critical { color: #dc2626; font-weight: bold; }
        .severity-high { color: #ea580c; font-weight: bold; }
        .severity-medium { color: #f59e0b; font-weight: bold; }
        .severity-low { color: #10b981; font-weight: bold; }
        .severity-info { color: #3b82f6; font-weight: bold; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #1f2937; }
        .stat-label { color: #666; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Security Assessment Report</h1>
        <p>Target: ${scan.targetUrl}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="executive-summary">
        <h2>Executive Summary</h2>
        <p>${executive.summary}</p>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">${summary.total}</div>
            <div class="stat-label">Total Findings</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" style="color: #dc2626;">${summary.grouped.critical.length}</div>
            <div class="stat-label">Critical</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" style="color: #ea580c;">${summary.grouped.high.length}</div>
            <div class="stat-label">High</div>
          </div>
        </div>
      </div>

      <div class="findings">
        <h2>Detailed Findings</h2>
        ${findingsHTML}
      </div>

      <p style="color: #999; font-size: 12px; margin-top: 40px;">
        Generated by SecureVault on ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `;

  const reportDoc = await Report.create({
    scanId,
    userId,
    format: 'html',
    title: `Security Report - ${scan.targetUrl}`,
    statistics: {
      totalFindings: findings.length,
      criticalCount: summary.grouped.critical.length,
      highCount: summary.grouped.high.length,
      mediumCount: summary.grouped.medium.length,
      lowCount: summary.grouped.low.length,
      infoCount: summary.grouped.info.length,
      scorePercentage: summary.riskScore
    }
  });

  return { html, reportDoc };
};

// Generate CSV report
export const generateCSVReport = async (scanId, userId) => {
  const findings = await Finding.find({ scanId });

  const headers = [
    'Finding ID',
    'Severity',
    'Type',
    'Title',
    'Description',
    'Location',
    'CWE',
    'CVSS Score',
    'Remediation'
  ];

  const rows = findings.map(f => [
    f._id.toString(),
    f.severity,
    f.type,
    f.title,
    f.description,
    f.location?.url || '',
    f.cwe?.id || '',
    f.cvss?.score || '',
    f.remediation || ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const reportDoc = await Report.create({
    scanId,
    userId,
    format: 'csv',
    title: `Security Report - Findings Export`,
    statistics: {
      totalFindings: findings.length
    }
  });

  return { csv, reportDoc };
};

// Get compliance mapping
function getComplianceMapping(findings) {
  const mapping = {
    'OWASP Top 10': {},
    'CWE/SANS Top 25': {}
  };

  // Map findings to OWASP Top 10 categories
  const owaspMap = {
    'sql_injection': 'A03:2021 - Injection',
    'xss': 'A07:2021 - Cross-Site Scripting (XSS)',
    'broken_auth': 'A01:2021 - Broken Access Control',
    'csrf': 'A07:2021 - Cross-Site Scripting (XSS)',
    'sensitive_data': 'A02:2021 - Cryptographic Failures',
    'xxe': 'A05:2021 - XML External Entities (XXE)'
  };

  for (const finding of findings) {
    for (const [type, owasp] of Object.entries(owaspMap)) {
      if (finding.type.includes(type)) {
        if (!mapping['OWASP Top 10'][owasp]) {
          mapping['OWASP Top 10'][owasp] = 0;
        }
        mapping['OWASP Top 10'][owasp]++;
      }
    }
  }

  return mapping;
}

export default {
  generateJSONReport,
  generateHTMLReport,
  generateCSVReport,
  generateExecutiveSummary,
  generateFindingsSummary
};
