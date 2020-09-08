module.exports = {
  "presets": [
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "@vue/babel-plugin-jsx", {
        transformOn: true
      }
    ],
    "@babel/plugin-proposal-optional-chaining"
  ],
  "env": {
    "test": {
      "presets": [
        "@babel/preset-typescript",
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": true,
            },
            useBuiltIns: "usage",
            corejs: 3
          }
        ],
      ]
    }
  }
}
