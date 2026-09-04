import app from './app.js';
import { connectDB } from './config/db.js';
import { seedInitialData } from './utils/seed.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Run initial seed check
  await seedInitialData();

  // Start HTTP Server
  app.listen(PORT, () => {
    console.log(`[Server] Adarsha School API Backend running on http://localhost:${PORT}`);
  });
}

startServer();
