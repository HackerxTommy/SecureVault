import crypto from 'crypto';
import axios from 'axios';
import Scan from '../models/Scan.js';
import scanQueue from './inMemoryQueue.service.js';
import config from '../config/env.js';

// Verify webhook signature
export const verifyWebhookSignature = (payload, signature) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || 'your-secret';
  const hash = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
};

// Handle pull request event
export const handlePullRequest = async (payload) => {
  const { action, pull_request, repository } = payload;

  console.log(`[WEBHOOK] PR ${action}: ${pull_request.number}`);

  if (action === 'opened' || action === 'synchronize') {
    // Create scan for PR
    const scanData = {
      targetUrl: repository.html_url,
      targetType: 'repo',
      scanMode: 'quick',
      prNumber: pull_request.number,
      prBranch: pull_request.head.ref,
      prAuthor: pull_request.user.login
    };

    return scanData;
  }
};

// Handle push event
export const handlePush = async (payload) => {
  const { ref, repository, pusher } = payload;

  console.log(`[WEBHOOK] Push to ${ref} by ${pusher.name}`);

  const scanData = {
    targetUrl: repository.html_url,
    targetType: 'repo',
    scanMode: 'standard',
    branch: ref.split('/').pop(),
    pushedBy: pusher.name
  };

  return scanData;
};

// Create GitHub comment with findings
export const createGitHubComment = async (owner, repo, prNumber, findings) => {
  if (!process.env.GITHUB_TOKEN) {
    console.log('[WEBHOOK] GitHub token not configured, skipping comment');
    return;
  }

  const critical = findings.filter(f => f.severity === 'critical').length;
  const high = findings.filter(f => f.severity === 'high').length;

  const comment = `## Security Scan Results

**Total Issues:** ${findings.length}  
**Critical:** ${critical}  
**High:** ${high}  

${critical > 0 ? 'Critical issues found - Review required' : 'No critical issues'}

### Issues by Severity
${critical > 0 ? `- Critical: ${critical}` : ''}
${high > 0 ? `- High: ${high}` : ''}

[View Full Report](${config.FRONTEND_URL}/scan/...)
`;

  try {
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      { body: comment },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    console.log(`[WEBHOOK] Comment created on PR #${prNumber}`);
  } catch (error) {
    console.error('[WEBHOOK] Failed to create GitHub comment:', error.message);
  }
};

// Update PR status check
export const updateGitHubStatus = async (owner, repo, sha, state, description) => {
  if (!process.env.GITHUB_TOKEN) return;

  try {
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/statuses/${sha}`,
      {
        state,
        description,
        context: 'SecureVault/Security',
        target_url: `${config.FRONTEND_URL}/scan/...` 
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    console.log(`[WEBHOOK] Status updated: ${state}`);
  } catch (error) {
    console.error('[WEBHOOK] Failed to update status:', error.message);
  }
};

export default {
  verifyWebhookSignature,
  handlePullRequest,
  handlePush,
  createGitHubComment,
  updateGitHubStatus
};
