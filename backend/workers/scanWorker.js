import scanQueue from '../src/services/scanQueue.service.js';
import Scan from '../src/models/Scan.js';
import reconService from '../src/services/recon.service.js';
import codeAnalysisService from '../src/services/codeAnalysis.service.js';
import connectDB from '../src/config/database.js';

await connectDB();

scanQueue.process(async (job) => {
  const { scanId, targetUrl, targetType, scanMode } = job.data;
  
  console.log(`[WORKER] Processing scan ${scanId}`);
  
  try {
    await Scan.findByIdAndUpdate(scanId, {
      status: 'running',
      startedAt: new Date()
    });

    // Phase 1: Reconnaissance (for web/api targets)
    if (targetType !== 'repo') {
      await job.progress(15);
      await updatePhase(scanId, 'reconnaissance', 'running');
      try {
        await reconService.runReconaissance(scanId, targetUrl, targetType);
        await updatePhase(scanId, 'reconnaissance', 'completed');
      } catch (error) {
        console.error(`[WORKER] Reconnaissance failed:`, error.message);
        await updatePhaseError(scanId, 'reconnaissance', error.message);
      }
    }

    // Phase 2: Code Analysis (for repo targets)
    if (targetType === 'repo') {
      await job.progress(15);
      await updatePhase(scanId, 'code_analysis', 'running');
      try {
        await codeAnalysisService.runCodeAnalysis(scanId, targetUrl, targetType);
        await updatePhase(scanId, 'code_analysis', 'completed');
      } catch (error) {
        console.error(`[WORKER] Code analysis failed:`, error.message);
        await updatePhaseError(scanId, 'code_analysis', error.message);
      }
    }

    // Phase 3: Vulnerability Scanning
    await job.progress(40);
    await updatePhase(scanId, 'vulnerability_scan', 'running');
    await simulateWork(3000);
    await updatePhase(scanId, 'vulnerability_scan', 'completed');

    // Phase 4: Exploitation Check
    await job.progress(70);
    await updatePhase(scanId, 'exploitation', 'running');
    await simulateWork(2000);
    await updatePhase(scanId, 'exploitation', 'completed');

    // Phase 5: Report Generation
    await job.progress(90);
    await updatePhase(scanId, 'reporting', 'running');
    await simulateWork(1000);
    await updatePhase(scanId, 'reporting', 'completed');

    // Complete scan
    await job.progress(100);
    const scan = await Scan.findByIdAndUpdate(
      scanId,
      {
        status: 'completed',
        completedAt: new Date(),
        progress: 100
      },
      { new: true }
    );

    // Calculate statistics
    const Finding = (await import('../src/models/Finding.js')).default;
    const findings = await Finding.countDocuments({ scanId });
    const critical = await Finding.countDocuments({ scanId, severity: 'critical' });
    const high = await Finding.countDocuments({ scanId, severity: 'high' });
    const medium = await Finding.countDocuments({ scanId, severity: 'medium' });
    const low = await Finding.countDocuments({ scanId, severity: 'low' });

    const duration = Math.floor((scan.completedAt - scan.startedAt) / 1000);
    await Scan.findByIdAndUpdate(scanId, {
      duration,
      'statistics.totalFindings': findings,
      'statistics.criticalCount': critical,
      'statistics.highCount': high,
      'statistics.mediumCount': medium,
      'statistics.lowCount': low
    });

    console.log(`[WORKER] Scan ${scanId} completed with ${findings} findings`);
    return { success: true, scanId, findings };
  } catch (error) {
    console.error(`[WORKER] Scan ${scanId} failed:`, error.message);
    await Scan.findByIdAndUpdate(scanId, {
      status: 'failed',
      completedAt: new Date()
    });
    throw error;
  }
});

async function updatePhase(scanId, phaseName, status) {
  const update = status === 'running' 
    ? { $push: { phases: { name: phaseName, status, startedAt: new Date() } } }
    : { $set: { 'phases.$[elem].status': status, 'phases.$[elem].completedAt': new Date() } };

  const options = status !== 'running'
    ? { arrayFilters: [{ 'elem.name': phaseName }] }
    : {};

  await Scan.updateOne({ _id: scanId }, update, options);
}

async function updatePhaseError(scanId, phaseName, error) {
  const update = { $set: { 'phases.$[elem].status': 'failed', 'phases.$[elem].error': error } };
  const options = { arrayFilters: [{ 'elem.name': phaseName }] };
  await Scan.updateOne({ _id: scanId }, update, options);
}

function simulateWork(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Scan worker started');
