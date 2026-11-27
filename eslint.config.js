import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'tests/**', 'scripts/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // Le code historique est compact (une instruction par ligne) : on ne bloque que les vraies erreurs.
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-case-declarations': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-useless-escape': 'warn',
      'no-cond-assign': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
