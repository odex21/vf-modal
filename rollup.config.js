import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import stylus from 'rollup-plugin-stylus-compiler'
import css from 'rollup-plugin-css-porter'
const extensions = [...DEFAULT_EXTENSIONS]
import commonjs from 'rollup-plugin-commonjs'

const TARGET = process.env.TARGET
if (!TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const browerEsm = TARGET === 'esm'

const output = browerEsm ?
  [
    {
      file: `dist/brower/index.js`,
      format: 'esm',
      paths: {
        vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
      }
    },
  ] : [
    {
      file: `dist/index.js`,
      format: 'esm',
    },
  ]

const external = [
  'vue',
  '@vue/composition-api',
  'ramda'
]

if (TARGET === 'es') {
  external.push('ramda')
}
console.log(process.env.NODE_ENV)

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
    browser: true,
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
    ],
  }),
  commonjs(),
  stylus(),
  css()
]

export default {
  input: 'src/index.tsx',
  output,
  plugins,
  external
}
