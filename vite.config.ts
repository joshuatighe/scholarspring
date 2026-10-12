/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Third-party code in its own chunks, so it stays cached across app deploys.
        codeSplitting: {
          groups: [
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    // Unit tests never talk to a real Supabase project, even when .env.local is present.
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      // Behind UTC, so date formatting bugs that shift a day show up in tests.
      TZ: 'America/Los_Angeles',
    },
  },
})
