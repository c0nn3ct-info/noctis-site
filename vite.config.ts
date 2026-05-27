import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(here, 'src') },
  },
  build: {
    outDir: path.resolve(here, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: path.resolve(here, 'index.html'),
        install: path.resolve(here, 'install/index.html'),
        privacy: path.resolve(here, 'privacy/index.html'),
        license: path.resolve(here, 'license/index.html'),
        'ru-home': path.resolve(here, 'ru/index.html'),
        'ru-install': path.resolve(here, 'ru/install/index.html'),
        'ru-privacy': path.resolve(here, 'ru/privacy/index.html'),
        'ru-license': path.resolve(here, 'ru/license/index.html'),
      },
    },
  },
  server: {
    port: 5180,
    strictPort: true,
  },
});
