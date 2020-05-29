import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import babel from 'rollup-plugin-babel'
// import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import stylus from 'rollup-plugin-stylus-compiler'
import css from 'rollup-plugin-css-porter'
const extensions = [ ...DEFAULT_EXTENSIONS, '.ts', '.tsx' ]
import commonjs from 'rollup-plugin-commonjs'

// const TARGET = process.env.TARGET
// if (!TARGET) {
//   throw new Error('TARGET package must be specified via --environment flag.')
// }


const output = [
  {
    file: `dist/index.js`,
    format: 'esm',
  },
]

const external = [
  'vue',
  'ramda'
]


console.log(process.env.NODE_ENV)

const MODE = process.env.MODE || 'dev'

const plugins = [
  clear({
    targets: [ 'dist' ],
    watch: true,
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
    extensions,
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
