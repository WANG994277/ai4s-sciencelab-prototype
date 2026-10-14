import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  copyPublicDir: false,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'next/navigation': path.resolve(root, 'src/compat/navigation.ts'),
      'next/link': path.resolve(root, 'src/compat/link.tsx'),
      'next/image': path.resolve(root, 'src/compat/image.tsx'),
      'next/dynamic': path.resolve(root, 'src/compat/dynamic.tsx'),
      '@': path.resolve(root, 'src'),
      '@shared': path.resolve(root, 'shared'),
    },
  },
  build: {
    outDir: path.resolve(root, '../prototype/assets/resource-app'),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(root, 'src/index.tsx'),
      name: 'AI4SResourceApp',
      formats: ['iife'],
      fileName: () => 'app.js',
      cssFileName: 'app',
    },
    rolldownOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
