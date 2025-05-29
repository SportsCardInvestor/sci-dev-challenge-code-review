module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: __dirname
  },
  extends: [
    "universe/native",
    "universe/shared/typescript-analysis"
  ],
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-floating-promises": "warn",
    "no-console": "error",
    "no-debugger": "error",
    "import/no-unresolved": "error",
    "@typescript-eslint/explicit-function-return-type": "off"
  },
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "dist/",
    "web-build/",
    "*.config.js",
    ".eslintrc.js",
    "**/*.d.ts"
  ],
  overrides: [
    {
      files: ["src/**/*.d.ts"],
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    }
  ]
};