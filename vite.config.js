import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    // Strip console.* and debugger statements in production builds only.
    // Dev keeps them so we can still debug; prod ships a quieter bundle
    // that doesn't leak request bodies, IDs, or server responses in DevTools.
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}))
