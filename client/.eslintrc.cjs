module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'coverage', 'node_modules', 'jest.config.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
  },
  overrides: [
    {
      // CommonJS config files (Cypress config, this file itself)
      files: ['cypress.config.js', '*.cjs'],
      env: { node: true, commonjs: true },
      parserOptions: { sourceType: 'script' },
    },
    {
      // Vitest test files — declare Vitest injected globals
      files: ['src/**/*.test.js', 'src/**/*.test.jsx'],
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    {
      // Cypress test files — declare Cypress injected globals
      files: ['cypress/**/*.cy.js', 'cypress/**/*.cy.jsx'],
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        context: 'readonly',
        expect: 'readonly',
      },
    },
  ],
};
