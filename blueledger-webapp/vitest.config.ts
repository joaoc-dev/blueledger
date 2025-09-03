import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({

  plugins: [
    react(),
    tsconfigPaths({
      root: rootDir,
      projects: [fileURLToPath(new URL('./tsconfig.json', import.meta.url))],
    }),
  ],
  resolve: {
    alias: {
      '@': rootDir,
      '@/components/ui/button': path.resolve(
        rootDir,
        './components/ui-modified/button',
      ),
      '@/components/ui/scroll-area': path.resolve(
        rootDir,
        './components/ui-modified/scroll-area',
      ),
    },
  },

  test: {
    cache: false, // Disable caching
    clearMocks: true,
    restoreMocks: true,
    setupFiles: ['./tests/setup.tsx'],

    coverage: {
      include: [
        'vitest-example/**/*.tsx',
        'lib/**/*.ts',
        'hooks/**/*.ts',
        'features/**/*.ts',
        'features/**/*.tsx',
        'components/layout/**/*.tsx',
        'components/shared/**/*.tsx',
        'app/api/**/*.ts',
      ],
      exclude: [
        'lib/db/**',
        'lib/pusher/**',
        'lib/auth/**',
        'lib/cloudinary.ts',
        'lib/resend.ts',
        'lib/react-query/**',
        'lib/data/**',
        'lib/api/withAuth.ts',
        'lib/logger.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'json'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [
            'lib/**/*{test,spec}.ts',
            'features/**/*{test,spec}.ts',
            'app/**/*{test,spec}.ts',
          ],
          exclude: ['hooks/**/*{test,spec}.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: [
            'hooks/**/*{test,spec}.ts',
            'hooks/**/*{test,spec}.tsx',
            'lib/**/*{test,spec}.tsx',
            'features/**/*{test,spec}.tsx',
            'components/layout/**/*{test,spec}.tsx',
            'components/shared/**/*{test,spec}.tsx',
          ],

          browser: {
            enabled: true,
            provider: 'playwright',
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: 'chromium', headless: true }],
          },
        },
      },
    ],

    globals: true,
  },
});
