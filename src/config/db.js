import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('CRITICAL: MONGODB_URI is not specified in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`[Database] MongoDB Atlas Connected cleanly: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB Atlas connection disconnected.');
  });
}
