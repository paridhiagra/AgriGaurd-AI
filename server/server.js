import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to DB (or graceful fallback)
  await connectDB();

  app.use(express.json());

  // Mount API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/farm', farmRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/gemini', geminiRoutes);
  app.use('/api/recommendation', recommendationRoutes);
  app.use('/api/recommendations', recommendationRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'AgriGuard AI',
      timestamp: new Date().toISOString()
    });
  });

  // Vite integration: middleware in development, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa',
      root: projectRoot,
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(projectRoot, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(projectRoot, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 AgriGuard AI server running at http://0.0.0.0:${PORT}`);
  });

  return { app, server };
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer().catch(err => {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  });
}
