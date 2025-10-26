/* ESLint config for a Vite + React project with Prettier interop */
const js = require("@eslint/js");

module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  extends: [
    js.configs.recommended,
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "eslint-config-prettier" // turn off rules that conflict with Prettier
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: "detect" }
  },
  rules: {
    "react/prop-types": "off",
    "react/jsx-key": "warn",
    "import/no-unresolved": "off" // Vite alias resolution handled by bundler
  }
};
