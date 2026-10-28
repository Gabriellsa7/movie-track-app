const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const prettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  globalIgnores([
    'dist/*',
    '.expo/*',
    'coverage/*',
    'expo-env.d.ts',
    'src/api/schema.d.ts',
  ]),
  expoConfig,
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // The const + type pair (EApiErrorCode) is intended, and axios.create is its documented API.
      '@typescript-eslint/no-redeclare': 'off',
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },
  prettier,
]);
