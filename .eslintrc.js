module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:hapi/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['hapi'],
  rules: {
    'hapi/no-shadow-relaxed': 'warn',
    'no-console': 'off',
    'no-process-env': 'off',
  },
};
