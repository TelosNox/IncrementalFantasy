import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/IncrementalFantasy/',
  plugins: [svelte()],
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
  },
})
