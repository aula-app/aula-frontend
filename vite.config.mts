/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.VITE_APP_BASENAME || '/',
  define: {
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION),
  },
  plugins: [
    tailwindcss(),
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
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/system',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      'react-hook-form',
      '@hookform/resolvers',
      'react-hook-form-mui',
      'yup',
      'react-markdown',
      'rehype-raw',
      'dayjs',
      'i18next',
      'react-i18next',
    ],
  },
  server: {
    open: true,
    port: 3000,
    watch: { ignored: ['**/tests/**', '**/auth_states/**', '**/ios/**', '**/android/**'] },
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
