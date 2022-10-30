import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react(), eslint()],
  define: {
    __APP_VERSION__: JSON.stringify('0.0.1'),
  },
  preview: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: { includes: (arg0: string) => any; toString: () => string }) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    emptyOutDir: false,
    outDir: 'dist/apps/publisher',
  },
});
