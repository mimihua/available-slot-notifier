import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import googleConfig from "eslint-config-google";
import pkg from '@eslint/js';
const { configs: eslintConfigs } = pkg;


export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "import": importPlugin,
    },   
    rules: {
      ...eslintConfigs.recommended.rules,
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
      ...importPlugin.configs.typescript.rules,
      // ↓↓↓googleConfig.rules↓↓↓
      ...googleConfig.rules,
      "valid-jsdoc": "off", // 禁用弃用的规则
      "require-jsdoc": "off", // 禁用不可用的规则
      // ↑↑↑googleConfig.rules↑↑↑   
      ...tseslint.configs.recommended.rules,
      "quotes": ["error", "double"],
      "import/no-unresolved": 0,
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"] // 确保使用 Unix 风格的换行符
    },
    ignores: [
      "/lib/**/*", // Ignore built files.
      "/generated/**/*", // Ignore generated files.
    ],
  }
];