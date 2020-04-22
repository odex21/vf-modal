import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import babel from 'rollup-plugin-babel'
// import { terser } from "rollup-plugin-terser"
import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

import { DEFAULT_EXTENSIONS } from '@babel/core'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: `dist/index.js`,
      format: 'esm',
      paths: {
        // brower esm mode
        vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
      }
    },
  ],
  external: [
    'vue'
  ],
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['dist'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts',
        '.tsx'
      ]
    }),
    typescript({
      tsconfig: 'tsconfig.json'
      // useTsconfigDeclarationDir: true
    }),
    // terser({}),
  ],

}
