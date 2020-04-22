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
export default {
  input: 'src/index.tsx',
  output: [
    {
      file: `dist/index.js`,
      format: 'esm',
    },
    {
      file: 'demo/vue-cli/RDialog/index.js',
      format: 'esm'
    }
  ],
  external: [
    'vue'
  ],
  plugins: [
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
    // terser(),
    stylus(),
    css()
  ],

}
