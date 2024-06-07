const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  globals: { Bun: 'readonly' },
  extends: ['eslint:recommended'],
  env: { node: true, es2022: true },
  parserOptions: { sourceType: 'module', ecmaVersion: 'latest' },
});
