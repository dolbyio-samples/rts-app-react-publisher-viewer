import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
  },
});
