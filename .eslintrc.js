module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'react-app',
    'prettier',
    'prettier/react'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier', 'prettier', 'react', '@typescript-eslint'],
  rules: {
    'lines-between-class-members': ["error", "always", { "exceptAfterSingleLine": true }],
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/prefer-default-export': 'off',
    'react/button-has-type': 'off',
    'semi': ["error", "always"],
    'object-curly-spacing': ["error", "always"],
    "react/jsx-indent" : ["error", 2],
    'react/prop-types': 'off',
    'no-shadow': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx', '.ts', '.js'] }],
    'import/extensions': 'off',
    "import/no-unresolved": 'off',
    "no-underscore-dangle": 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    'no-console': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'no-param-reassign': 'off'
  },
  settings: {
    'import/resolver': {},

  },
};
