import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    coverage: {
      include: [
        'vitest-example/**/*.tsx',
        'lib/**/*.ts',
        'hooks/**/*.ts',
        'features/**/*.ts',
        'features/**/*.tsx',
        'components/layout/**/*.tsx',
        'components/shared/**/*.tsx',
        'app/**/*.tsx',
        'app/**/*.ts',
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
            'vitest-example/**/*{test,spec}.tsx',
            'hooks/**/*{test,spec}.ts',
            'features/**/*{test,spec}.tsx',
            'components/layout/**/*{test,spec}.tsx',
            'components/shared/**/*{test,spec}.tsx',
            'app/**/*{test,spec}.tsx',
            'app/**/*{test,spec}.ts',
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
