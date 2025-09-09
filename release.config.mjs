/** @type {import('semantic-release').GlobalConfig} */
export default {
  // ――― Branch policy ―――
  // A new release is cut **only** when commits land on `main`.
  // `dev`, and `hotfix/*` branches can merge into `main` whenever they’re ready,
  // but they will not trigger a release on their own.
  branches: ['main'],

  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};
