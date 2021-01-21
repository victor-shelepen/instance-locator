module.exports = {
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
  },
  plugins: ["jest"],
  env: {
    node: true,
    es6: true,
    "jest/globals": true 
  }
}
