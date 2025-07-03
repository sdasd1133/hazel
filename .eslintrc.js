module.exports = {
  extends: "next/core-web-vitals",
  ignorePatterns: [".next/**"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
  }
};
