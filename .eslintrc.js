module.exports = {
  extends: "next/core-web-vitals",
  ignorePatterns: [".next/**"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-explicit-any": "off"
  }
};
