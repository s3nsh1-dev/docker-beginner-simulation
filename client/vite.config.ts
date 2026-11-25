import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(async ({ isPreview }) => {
  const plugins = isPreview
    ? []
    : (await import('@vitejs/plugin-react')).default()

  return {
    plugins,
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: true,
      allowedHosts: true as const,
      proxy: {
        '/api': {
          target: process.env.API_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
