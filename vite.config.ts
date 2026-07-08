import {resolve} from 'node:path'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

const examplesDir = resolve(import.meta.dirname, 'examples')

export default defineConfig(() => ({
  build: {
    rollupOptions: {
      input: {
        'dnd-multi-backend': resolve(examplesDir, 'dnd-multi-backend.html'),
        index: resolve(examplesDir, 'index.html'),
        'react-dnd-multi-backend': resolve(examplesDir, 'react-dnd-multi-backend.html'),
        'react-dnd-preview': resolve(examplesDir, 'react-dnd-preview.html'),
        'react-dnd-preview_offset': resolve(examplesDir, 'react-dnd-preview_offset.html'),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      'dnd-multi-backend': resolve(import.meta.dirname, 'packages/dnd-multi-backend/src'),
      'rdndmb-html5-to-touch': resolve(import.meta.dirname, 'packages/rdndmb-html5-to-touch/src'),
      'react-dnd-preview': resolve(import.meta.dirname, 'packages/react-dnd-preview/src'),
    },
  },
  server: {
    port: 1821,
  },
}))
