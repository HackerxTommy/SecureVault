import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  targetUrl: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['web', 'api', 'repo', 'pr'],
    required: true
  },
  scanMode: {
    type: String,
    enum: ['quick', 'standard', 'deep', 'whitebox', 'blackbox'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  phases: [{
    name: String,
    status: String,
    startedAt: Date,
    completedAt: Date,
    error: String
  }],
  statistics: {
    totalFindings: { type: Number, default: 0 },
    criticalCount: { type: Number, default: 0 },
    highCount: { type: Number, default: 0 },
    mediumCount: { type: Number, default: 0 },
    lowCount: { type: Number, default: 0 },
    infoCount: { type: Number, default: 0 }
  },
  startedAt: Date,
  completedAt: Date,
  duration: Number,
  metadata: mongoose.Schema.Types.Mixed,
  source: {
    type: String,
    enum: ['dashboard', 'webhook', 'api'],
    default: 'dashboard'
  },
  options: {
    enableOAuth: { type: Boolean, default: false },
    enableAttackSurface: { type: Boolean, default: false },
    enableThreatIntel: { type: Boolean, default: false },
    scheduleScan: { type: Boolean, default: false },
    scheduleInterval: { type: String, default: 'daily' },
    sessionAnalysis: { type: Boolean, default: false },
    cookieAnalysis: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

scanSchema.index({ userId: 1, createdAt: -1 });
scanSchema.index({ status: 1 });

export default mongoose.model('Scan', scanSchema);
