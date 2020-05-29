module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    // override/ add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/singleline-html-element-content-newline": 0,
    //   [ "warn", {
    //   "ignoreWhenNoAttributes": true,
    //   "ignoreWhenEmpty": true,
    //   "ignores": [ "pre", "textarea", "button", "slot" ]
    // } ],
    // "vue/valid-template-root": 0,
    "vue/html-self-closing": [ "error", {
      "html": {
        "void": "any",
        "normal": "any",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    } ],
    "vue/max-attributes-per-line": [ "error", {
      "singleline": 4,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    } ],
    // ts
    "object-curly-spacing": [ "error", "always" ],
    "array-bracket-spacing": [ "error", "always" ],
    "linebreak-style": [ "error", "windows" ],
    "space-before-function-paren": [ "error", "always" ],
    "computed-property-spacing": [ "error", "always" ]
  }
}
