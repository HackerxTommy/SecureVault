import axios from 'axios';
import Finding from '../models/Finding.js';

// Subdomain enumeration using DNS
export const enumerateSubdomains = async (domain) => {
  const subdomains = [];
  const commonPrefixes = [
    'www', 'mail', 'ftp', 'admin', 'test', 'api', 'dev', 'staging',
    'cdn', 'assets', 'images', 'static', 'docs', 'blog', 'shop',
    'auth', 'login', 'dashboard', 'app', 'mobile', 'v1', 'v2'
  ];

  for (const prefix of commonPrefixes) {
    const subdomain = `${prefix}.${domain}`;
    try {
      const response = await axios.get(`http://${subdomain}`, {
        timeout: 2000,
        validateStatus: () => true
      });
      
      if (response.status !== 404 && response.status !== 403) {
        subdomains.push({
          subdomain,
          statusCode: response.status,
          discoveredAt: new Date()
        });
      }
    } catch (error) {
      // Subdomain not found, continue
    }
  }

  return subdomains;
};

// Port scanning simulation (in production, use proper port scanner)
export const scanPorts = async (host) => {
  const commonPorts = [80, 443, 8080, 8443, 3000, 5000, 8000, 9000, 27017, 6379];
  const openPorts = [];

  for (const port of commonPorts) {
    try {
      const response = await axios.get(`http://${host}:${port}`, {
        timeout: 2000,
        validateStatus: () => true
      });
      
      if (response.status >= 200 && response.status < 500) {
        openPorts.push({
          port,
          status: 'open',
          statusCode: response.status,
          service: getServiceName(port)
        });
      }
    } catch (error) {
      // Port likely closed
    }
  }

  return openPorts;
};

// Technology fingerprinting
export const detectTechnologies = async (url) => {
  const technologies = [];

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const headers = response.headers;
    const html = typeof response.data === 'string' ? response.data : '';

    // Detect by headers
    if (headers['server']) {
      technologies.push({
        name: headers['server'],
        type: 'web_server',
        confidence: 'high',
        evidence: `Server header: ${headers['server']}` 
      });
    }

    if (headers['x-powered-by']) {
      technologies.push({
        name: headers['x-powered-by'],
        type: 'framework',
        confidence: 'high',
        evidence: `X-Powered-By header: ${headers['x-powered-by']}` 
      });
    }

    // Detect by HTML patterns
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes('react') || lowerHtml.includes('reactdom')) {
      technologies.push({
        name: 'React',
        type: 'frontend',
        confidence: 'medium',
        evidence: 'Found React in page source'
      });
    }

    if (lowerHtml.includes('angular') || lowerHtml.includes('ng-app')) {
      technologies.push({
        name: 'Angular',
        type: 'frontend',
        confidence: 'medium',
        evidence: 'Found Angular in page source'
      });
    }

    if (lowerHtml.includes('vue') || lowerHtml.includes('v-')) {
      technologies.push({
        name: 'Vue.js',
        type: 'frontend',
        confidence: 'medium',
        evidence: 'Found Vue in page source'
      });
    }

    // Detect by common framework signatures
    if (html.includes('wp-content') || html.includes('wp-includes')) {
      technologies.push({
        name: 'WordPress',
        type: 'cms',
        confidence: 'high',
        evidence: 'Found WordPress patterns'
      });
    }

    return technologies;
  } catch (error) {
    return technologies;
  }
};

// Detect exposed secrets using regex patterns
export const scanForSecrets = async (url) => {
  const secrets = [];
  const patterns = {
    AWS_KEY: /AKIA[0-9A-Z]{16}/g,
    PRIVATE_KEY: /-----BEGIN (?:RSA|DSA|EC|PGP) PRIVATE KEY/g,
    API_KEY: /api[_-]?key["\s:=]+(["\']?)([a-zA-Z0-9_\-]{20,})\1/gi,
    GITHUB_TOKEN: /ghp_[0-9a-zA-Z]{36}/g,
    SLACK_TOKEN: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g,
    DATABASE_URL: /(?:mongodb|mysql|postgres)[+:\/\/]+[^\s]+/gi
  };

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true
    });

    const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = content.match(pattern);
      if (matches) {
        secrets.push({
          type,
          count: matches.length,
          severity: 'critical',
          description: `Potential ${type} detected in response` 
        });
      }
    }

    return secrets;
  } catch (error) {
    return secrets;
  }
};

// Check for common security headers
export const scanSecurityHeaders = async (url) => {
  const missingHeaders = [];
  const requiredHeaders = {
    'strict-transport-security': 'HSTS',
    'content-security-policy': 'CSP',
    'x-content-type-options': 'X-Content-Type-Options',
    'x-frame-options': 'X-Frame-Options',
    'x-xss-protection': 'X-XSS-Protection',
    'referrer-policy': 'Referrer-Policy'
  };

  try {
    const response = await axios.head(url, { timeout: 5000 });
    const headers = response.headers;

    for (const [headerName, headerLabel] of Object.entries(requiredHeaders)) {
      if (!headers[headerName]) {
        missingHeaders.push({
          header: headerLabel,
          severity: 'medium',
          recommendation: `Add ${headerLabel} header to response` 
        });
      }
    }

    return missingHeaders;
  } catch (error) {
    return [];
  }
};

// Helper function to get service name from port
function getServiceName(port) {
  const services = {
    80: 'HTTP',
    443: 'HTTPS',
    8080: 'HTTP-Proxy',
    8443: 'HTTPS-Proxy',
    3000: 'Node.js',
    5000: 'Flask/Node.js',
    8000: 'Django/Node.js',
    9000: 'PHP-FPM',
    27017: 'MongoDB',
    6379: 'Redis'
  };
  return services[port] || 'Unknown';
}

// Main reconnaissance workflow
export const runReconaissance = async (scanId, targetUrl, targetType) => {
  const findings = [];

  try {
    // Extract domain from URL
    const url = new URL(targetUrl);
    const domain = url.hostname;

    // 1. Enumerate subdomains
    console.log(`[RECON] Enumerating subdomains for ${domain}`);
    const subdomains = await enumerateSubdomains(domain);
    
    if (subdomains.length > 0) {
      await Finding.create({
        scanId,
        severity: 'info',
        type: 'subdomain_enumeration',
        title: `${subdomains.length} Subdomains Discovered`,
        description: `Found subdomains: ${subdomains.map(s => s.subdomain).join(', ')}`,
        evidence: {
          proof: JSON.stringify(subdomains)
        }
      });
    }

    // 2. Scan ports
    console.log(`[RECON] Scanning common ports on ${domain}`);
    const ports = await scanPorts(domain);
    
    if (ports.length > 1) { // More than just 80/443
      await Finding.create({
        scanId,
        severity: 'info',
        type: 'port_scan',
        title: `${ports.length} Open Ports Detected`,
        description: `Open ports: ${ports.map(p => p.port).join(', ')}`,
        evidence: {
          proof: JSON.stringify(ports)
        }
      });
    }

    // 3. Detect technologies
    console.log(`[RECON] Detecting technologies`);
    const techs = await detectTechnologies(targetUrl);
    
    if (techs.length > 0) {
      await Finding.create({
        scanId,
        severity: 'info',
        type: 'technology_detection',
        title: `${techs.length} Technologies Identified`,
        description: `Detected: ${techs.map(t => t.name).join(', ')}`,
        evidence: {
          proof: JSON.stringify(techs)
        }
      });
    }

    // 4. Check security headers
    console.log(`[RECON] Checking security headers`);
    const missingHeaders = await scanSecurityHeaders(targetUrl);
    
    if (missingHeaders.length > 0) {
      await Finding.create({
        scanId,
        severity: 'medium',
        type: 'missing_security_headers',
        title: `${missingHeaders.length} Missing Security Headers`,
        description: `Missing headers: ${missingHeaders.map(h => h.header).join(', ')}`,
        remediation: 'Add security headers to HTTP responses',
        evidence: {
          proof: JSON.stringify(missingHeaders)
        }
      });
    }

    // 5. Scan for exposed secrets
    console.log(`[RECON] Scanning for exposed secrets`);
    const secrets = await scanForSecrets(targetUrl);
    
    if (secrets.length > 0) {
      for (const secret of secrets) {
        await Finding.create({
          scanId,
          severity: 'critical',
          type: 'exposed_secret',
          title: `Potential ${secret.type} Exposed`,
          description: secret.description,
          remediation: 'Remove exposed credentials immediately and rotate keys',
          evidence: {
            proof: `${secret.count} matches found` 
          }
        });
      }
    }

    console.log(`[RECON] Reconnaissance completed`);
    return {
      success: true,
      findingsCount: findings.length
    };
  } catch (error) {
    console.error('[RECON] Error during reconnaissance:', error.message);
    throw error;
  }
};

export default {
  enumerateSubdomains,
  scanPorts,
  detectTechnologies,
  scanForSecrets,
  scanSecurityHeaders,
  runReconaissance
};
