import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '',
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
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});