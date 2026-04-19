import inMemoryQueue from './inMemoryQueue.service.js';

export const scanQueue = inMemoryQueue;

scanQueue.on('completed', (job) => {
  console.log(`✓ Job ${job.id} completed`);
});

scanQueue.on('failed', (job, err) => {
  console.error(`✗ Job ${job.id} failed:`, err.message);
});

scanQueue.on('active', (job) => {
  console.log(`▶ Job ${job.id} started`);
});

export default scanQueue;
