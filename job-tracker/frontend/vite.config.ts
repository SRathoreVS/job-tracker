import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep this file tiny on purpose — Vite's defaults are good.
// We only add the React plugin so JSX/TSX works.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
