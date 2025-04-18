import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Already off
      "@typescript-eslint/no-explicit-any": "off", // Already off

      // Added rules based on your request:

      // Change 'no-unused-expressions' from error to warning
      "@typescript-eslint/no-unused-expressions": "warn",

      // Or uncomment the line below to turn 'no-unused-expressions' completely off:
      // "@typescript-eslint/no-unused-expressions": "off",

      // Turn off the 'react-hooks/exhaustive-deps' warning
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;