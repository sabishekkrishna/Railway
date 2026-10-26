import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import path from 'path';
import { apiRouter } from './src/server/routes.ts';

const rootDir = import.meta.dirname;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Mount backend API
  app.use('/api', apiRouter);

  // In production serve dist, in dev mount Vite middlewares
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[IR-OCC] Railway Station Operations Control Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[IR-OCC] Failed to start server:', err);
  process.exit(1);
});
