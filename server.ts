import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CONFIG } from './server/config.js';
import {
  rateLimiter,
  securityHeaders,
  logSafeRequest,
} from './server/middleware/security.js';
import { apiRouter } from './server/api/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  // Body parser with 15MB limit for document uploads
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Security headers & safe anonymized logging
  app.use(securityHeaders);
  app.use(logSafeRequest);

  // Rate limiting for API endpoints
  app.use('/api', rateLimiter);

  // Mount API router
  app.use('/api', apiRouter);

  if (!isProd) {
    // Development mode: Mount Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('[Server] dist directory not found. Please run npm run build.');
    }
  }

  const port = CONFIG.PORT;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[LegalEase AI] Server running on http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });
}

createServer().catch((err) => {
  console.error('[LegalEase AI] Fatal startup error:', err);
  process.exit(1);
});
