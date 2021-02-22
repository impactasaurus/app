module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "@typescript-eslint/no-var-requires": "warn",
    "react/no-deprecated": "warn",
    "react/no-unescaped-entities": "warn",
    "no-irregular-whitespace": "warn",
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "react/display-name": "warn"
  }
};
