import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_APP_BASENAME || '/',
  define: {
    'process.env.VITE_APP_VERSION': process.env.VITE_APP_VERSION,
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  assetsInclude: ['**/*.md'],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
