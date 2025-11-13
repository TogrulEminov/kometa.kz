// eslint.config.mjs
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
      "@typescript-eslint/no-explicit-any": "off", // ✅ Bunu əlavə edin
      "@next/next/no-img-element": "off", // ✅ <img> tag-ı üçün
      "jsx-a11y/alt-text": "off", // ✅ alt text xəbərdarlığı
      // Prisma və third-party library xətaları üçün
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // React hooks
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Prisma və wasm faylları tamamilə ignore et
    ignores: [
      "src/generated/prisma/**",
      "**/wasm.js",
      "**/react-native.js",
      "**/wasm-*.js",
    ],
  },
];

export default eslintConfig;
