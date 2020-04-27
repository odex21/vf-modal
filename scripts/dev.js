const execa = require('execa')

const target = 'esm'

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `TARGET:${target}`,
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
