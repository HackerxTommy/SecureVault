// Simple in-memory queue to replace Bull/Redis
class InMemoryQueue {
  constructor(name) {
    this.name = name;
    this.jobs = [];
    this.processors = [];
    this.jobIdCounter = 0;
    this.eventHandlers = {};
  }

  add(data, options = {}) {
    const job = {
      id: ++this.jobIdCounter,
      data,
      options,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      processedAt: null,
      completedAt: null,
      failedAt: null,
      attempts: 0,
      error: null
    };

    this.jobs.push(job);
    this.emit('added', job);

    // Start processing if a processor is registered
    if (this.processors.length > 0) {
      this.processJob(job);
    }

    return job;
  }

  process(processorFn) {
    this.processors.push(processorFn);

    // Process any pending jobs
    const pendingJobs = this.jobs.filter(j => j.status === 'pending');
    pendingJobs.forEach(job => this.processJob(job));
  }

  async processJob(job) {
    job.status = 'active';
    job.processedAt = new Date();
    this.emit('active', job);

    try {
      const processor = this.processors[0];
      if (!processor) {
        throw new Error('No processor registered');
      }

      // Create job-like object with progress method
      const jobWrapper = {
        data: job.data,
        progress: (percent) => {
          job.progress = percent;
          this.emit('progress', job, percent);
        },
        id: job.id
      };

      const result = await processor(jobWrapper);

      job.status = 'completed';
      job.completedAt = new Date();
      job.progress = 100;
      this.emit('completed', job, result);
    } catch (error) {
      job.attempts = (job.attempts || 0) + 1;
      job.error = error.message;

      const maxAttempts = job.options?.attempts || 3;

      if (job.attempts < maxAttempts) {
        job.status = 'pending';
        this.emit('failed', job, error);
        
        // Retry after delay
        const delay = job.options?.backoff?.delay || 2000;
        setTimeout(() => this.processJob(job), delay);
      } else {
        job.status = 'failed';
        job.failedAt = new Date();
        this.emit('failed', job, error);
      }
    }
  }

  getJobs(states = []) {
    if (states.length === 0) {
      return this.jobs;
    }
    return this.jobs.filter(job => states.includes(job.status));
  }

  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  emit(event, ...args) {
    const handlers = this.eventHandlers[event] || [];
    handlers.forEach(handler => handler(...args));
  }

  async getJob(jobId) {
    return this.jobs.find(j => j.id === jobId);
  }

  async remove(jobId) {
    const index = this.jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      return true;
    }
    return false;
  }

  async close() {
    this.jobs = [];
    this.processors = [];
    this.eventHandlers = {};
  }
}

// Create singleton instance
const scanQueue = new InMemoryQueue('scan-processing');

// Add event listeners for logging
scanQueue.on('completed', (job) => {
  console.log(`[QUEUE] Job ${job.id} completed`);
});

scanQueue.on('failed', (job, err) => {
  console.error(`[QUEUE] Job ${job.id} failed:`, err.message);
});

scanQueue.on('active', (job) => {
  console.log(`[QUEUE] Job ${job.id} started`);
});

scanQueue.on('progress', (job, progress) => {
  console.log(`[QUEUE] Job ${job.id} progress: ${progress}%`);
});

export default scanQueue;
