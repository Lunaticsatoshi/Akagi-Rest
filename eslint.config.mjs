import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    root: true,
    parser: '@typescript-eslint/parser',
    // parserOptions: {
    //   project: 'tsconfig.json',
    //   sourceType: 'module',
    // },
    plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'simple-import-sort'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    ignorePatterns: ['eslint.config.mjs', 'node_modules/', 'build/', 'dist/', 'coverage', 'tsconfig.json'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    },
  }),
]

export default eslintConfig
