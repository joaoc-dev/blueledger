import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    'components/third-party/**',
    'components/ui/**',
    // 'lib/utils/**',
    // 'src/utils/legacy/**',                 // ignore folder
    // 'src/types/some-type.ts',              // ignore specific file
    // 'eslint',                              // ignore dependency
    // 'some-unused-export-name',             // ignore specific unused export
    // '**/*.stories.tsx',                    // glob pattern
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
