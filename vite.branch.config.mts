import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config()

const basename = process.env.VITE_APP_BASENAME;

export default defineConfig({
  base: basename,
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
