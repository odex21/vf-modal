import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import stylus from 'rollup-plugin-stylus-compiler'
import css from 'rollup-plugin-css-porter'
import { terser } from "rollup-plugin-terser"
const extensions = [DEFAULT_EXTENSIONS]
import commonjs from 'rollup-plugin-commonjs'

const TARGET = process.env.TARGET
if (!TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

console.log(TARGET)

const MODE = process.env.MODE || 'dev'

const plugins = [
  clear({
    targets: ['dist'],
    watch: true,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  resolve({
    jsnext: true,
    browser: true,
    main: true,
    preferBuiltins: false,
    extensions,
  }),
  typescript({
    tsconfig: 'tsconfig.json',
  }),
  babel({
    exclude: 'node_modules/**', // only transpile our source code
    extensions: [
      ...DEFAULT_EXTENSIONS,
      '.ts',
      '.tsx'
    ]
  }),
  commonjs(),
  stylus(),
  css()
]
if (MODE === 'production') {
  plugins.push(terser())
}


export default {
  input: 'src/index.tsx',
  output: [
    {
      file: `dist/index.js`,
      format: 'esm',
    },
    {
      file: `dist/brower/index.js`,
      format: 'esm',
      paths: {
        vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
      }
    },
  ],
  external: [
    'vue'
  ],
  plugins
}
