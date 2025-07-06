import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For configs that don't yet have native flat config support
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Use js recommended rules directly
  js.configs.recommended,

  // Base configuration for all files
  {
    ignores: ["node_modules/**", ".next/**", "dist/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser globals
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
      },
      parser: typescriptParser,
      parserOptions: {
        project: resolve(__dirname, "./tsconfig.json"),
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // TypeScript rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      ...typescriptPlugin.configs["recommended-requiring-type-checking"].rules,
      ...typescriptPlugin.configs.recommended.rules,
    },
  },

  // Next.js rules
  {
    files: ["app/**/*", "pages/**/*", "components/**/*"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Core web vitals rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
  },

  // Add prettier config directly (no compat needed)
  prettier,
  // Use compatibility layer only for Next.js configs that don't have native support
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
