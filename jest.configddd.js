module.exports = {
  "collectCoverage": true,
  "collectCoverageFrom": ["dist/*.js"],
  "coverageReporters": ["html", "text-summary"],
  "moduleFileExtensions": [
    "js",
    "json",
    // 告诉 Jest 处理 `*.vue` 文件
    "vue"
  ],
  transform: {
    // 用 `vue-jest` 处理 `*.vue` 文件
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": ["babel-jest"],
    // "\\.js$": ['babel-jest', { rootMode: "upward" }]
  },
  "transformIgnorePatterns": [
    // Change MODULE_NAME_HERE to your module that isn't being compiled
    "/node_modules/(?!MODULE_NAME_HERE).+\\.js$"
  ],
  "moduleNameMapper": {
    "^vue$": "vue/dist/vue.common.js"
  },
  // rootDir: __dirname,
  transformIgnorePatterns: ['/node_modules/']
}
