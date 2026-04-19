import mongoose from 'mongoose';
import config from './env.js';

export const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Add SSL options for MongoDB Atlas
    if (config.MONGODB_URI.includes('mongodb+srv')) {
      options.ssl = true;
      options.tlsAllowInvalidCertificates = false;
    }

    await mongoose.connect(config.MONGODB_URI, options);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
