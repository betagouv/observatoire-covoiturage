module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  ignorePatterns: ['old'],
  rules: {
    semi: ['error', 'always'],
    'prettier/prettier': [
      'error', // /!\ integrating prettier for eslint not working -> https://github.com/prettier/eslint-plugin-prettier
      {
        printWidth: 120,
        singleQuote: true,
        useTabs: false,
        tabWidth: 2,
        semi: true,
        bracketSpacing: true,
        arrowParens: 'always',
        trailingComma: 'all',
        endOfLine: 'lf',
        jsxSingleQuote: true,
      },
    ],
    'max-len': ['warn', { code: 120 }],
    'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug', 'table'] }],
    'prefer-template': 'error',
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off', // postgresql compat
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};