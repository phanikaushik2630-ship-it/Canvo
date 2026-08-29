import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && !('headersSent' in res && res.headersSent)) {
              (res as any).writeHead(503, {
                'Content-Type': 'application/json',
              });
              (res as any).end(JSON.stringify({ error: 'Backend server is unreachable. Operating in client fallback mode.' }));
            }
          });
        },
      },
    },
  },
});
