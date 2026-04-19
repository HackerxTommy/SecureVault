import mongoose from 'mongoose';

const findingSchema = new mongoose.Schema({
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low', 'info'],
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    url: String,
    parameter: String,
    line: Number,
    file: String
  },
  cvss: {
    score: Number,
    vector: String
  },
  cwe: {
    id: String,
    name: String
  },
  evidence: {
    request: String,
    response: String,
    proof: String
  },
  remediation: String,
  references: [String],
  status: {
    type: String,
    enum: ['open', 'confirmed', 'false_positive', 'fixed'],
    default: 'open'
  }
}, {
  timestamps: true
});

findingSchema.index({ scanId: 1 });
findingSchema.index({ severity: 1 });
findingSchema.index({ type: 1 });

export default mongoose.model('Finding', findingSchema);
