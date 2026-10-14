import path from 'path'
import { defineConfig } from '@lark-apaas/coding-preset-vite-react'

export default defineConfig({
  resolve: {
    alias: {
      'next/navigation': path.resolve(__dirname, 'src/compat/navigation.ts'),
      'next/link': path.resolve(__dirname, 'src/compat/link.tsx'),
      'next/image': path.resolve(__dirname, 'src/compat/image.tsx'),
      'next/dynamic': path.resolve(__dirname, 'src/compat/dynamic.tsx'),
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})
