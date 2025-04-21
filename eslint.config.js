import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      // Add other rules as needed
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
    ],
  },
];