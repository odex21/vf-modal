module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom-fifteen',

  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require('./package.json').version,
    __BROWSER__: false,
    __GLOBAL__: false,
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: false,
    __NODE_JS__: true,
    __FEATURE_OPTIONS__: true,
    __FEATURE_SUSPENSE__: true,
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'src/*.tsx',
    'src/*.ts'
  ],
  // watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'vue'],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    // 用 `vue-jest` 处理 `*.vue` 文件
    "^.+\\.vue$": "vue-jest"
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // "^vue$": "vue/dist/vue.common.js",
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
  },
  rootDir: __dirname,
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
