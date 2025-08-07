import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    'components/third-party/**',
    'components/ui/**',
    'components/ui-modified/**',
    'lib/auth/auth.ts',
    'lib/utils/**',
    'components/shared/data-table/rows/row-skeleton.tsx',
    'lib/cloudinary.ts',

    // for the following, its common to have exports that cycle between being used and not used
    // if you want a quick check on the health of this files, feel free to comment them out
    // data
    'features/notifications/data.ts',
    'features/expenses/data.ts',
    // client api
    'features/notifications/client.ts',
    'features/expenses/client.ts',
    // schemas
    'features/notifications/schemas.ts',
    'features/expenses/schemas.ts',
    'features/users/schemas.ts',
  ],
  ignoreDependencies: [
    'require-in-the-middle',
    'import-in-the-middle',
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
