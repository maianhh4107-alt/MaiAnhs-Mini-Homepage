import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH || './';

function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-endpoints',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/calendar/summary')) {
          const url = new URL(req.url, 'http://localhost');
          const tz = url.searchParams.get('timeZone') || 'UTC';
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              currentDate: `${year}-${month}-${day}`,
              month: `${year}-${month}`,
              timeZone: tz,
              events: [
                {
                  id: 'event-01',
                  summary: 'Mini Homepage Launch ✦',
                  start: `${year}-${month}-${day}T10:00:00Z`,
                  end: `${year}-${month}-${day}T11:00:00Z`,
                  allDay: false,
                  htmlLink: null,
                },
              ],
            }),
          );
          return;
        }
        if (req.url === '/api/healthz' || req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
