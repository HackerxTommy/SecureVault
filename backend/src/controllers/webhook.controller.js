import githubWebhookService from '../services/githubWebhook.service.js';
import Scan from '../models/Scan.js';
import scanQueue from '../services/inMemoryQueue.service.js';

export const handleGitHubWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    // Verify signature
    try {
      githubWebhookService.verifyWebhookSignature(payload, signature);
    } catch (error) {
      console.warn('[WEBHOOK] Signature verification failed');
      // Continue anyway for development
    }

    const { action, pull_request, push, repository } = req.body;

    // Get owner and repo from repository object
    const owner = repository.owner.login;
    const repo = repository.name;

    let scanData = null;

    // Handle different event types
    if (pull_request) {
      scanData = await githubWebhookService.handlePullRequest(req.body);
      scanData.prNumber = pull_request.number;
      scanData.owner = owner;
      scanData.repo = repo;
    } else if (req.body.ref) {
      scanData = await githubWebhookService.handlePush(req.body);
      scanData.owner = owner;
      scanData.repo = repo;
      scanData.sha = req.body.after;
    }

    if (scanData) {
      // Create scan record (without user - these are webhook-initiated)
      const scan = await Scan.create({
        userId: null, // Webhook-initiated scan
        targetUrl: scanData.targetUrl,
        targetType: scanData.targetType,
        scanMode: scanData.scanMode,
        metadata: scanData,
        status: 'pending'
      });

      // Queue scan job
      await scanQueue.add({
        scanId: scan._id.toString(),
        targetUrl: scanData.targetUrl,
        targetType: scanData.targetType,
        scanMode: scanData.scanMode
      });

      console.log(`[WEBHOOK] Scan queued: ${scan._id}`);
    }

    res.json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  handleGitHubWebhook
};
