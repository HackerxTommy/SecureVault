import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './src/config/env.js';
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import scanRoutes from './src/routes/scan.routes.js';
import reconRoutes from './src/routes/recon.routes.js';
import codeAnalysisRoutes from './src/routes/codeAnalysis.routes.js';
import reportRoutes from './src/routes/report.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import { errorHandler, notFound } from './src/middleware/error.middleware.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/recon', reconRoutes);
app.use('/api/code-analysis', codeAnalysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
