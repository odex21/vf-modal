module.exports = {
  "presets": [
    [
      "@vue/babel-preset-jsx",
      {
        "vModel": false
      }
    ]
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@vue/babel-preset-jsx",
          {
            "vModel": false
          }
        ],
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
