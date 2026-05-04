module.exports = {
  root: true,
  env: { node: true, es2020: true, commonjs: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 2020 },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: { jest: true },
    },
  ],
  rules: {},
};
