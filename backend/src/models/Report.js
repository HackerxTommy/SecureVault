import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  format: {
    type: String,
    enum: ['pdf', 'html', 'json', 'csv'],
    required: true
  },
  title: String,
  filePath: String,
  fileSize: Number,
  pageCount: Number,
  statistics: {
    totalFindings: Number,
    criticalCount: Number,
    highCount: Number,
    mediumCount: Number,
    lowCount: Number,
    infoCount: Number,
    scorePercentage: Number
  },
  metadata: {
    generatedBy: String,
    complianceStandards: [String],
    executiveSummary: String
  }
}, {
  timestamps: true
});

reportSchema.index({ scanId: 1 });
reportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
