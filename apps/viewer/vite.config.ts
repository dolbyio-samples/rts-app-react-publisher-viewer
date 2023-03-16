import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist/apps/viewer',
    rollupOptions: {
      output: {
        manualChunks(id: { includes: (arg0: string) => unknown; toString: () => string }) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }

          return;
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('2.0.1'),
  },
  plugins: [tsconfigPaths(), react(), eslint()],
  preview: {
    open: false,
  },
});
