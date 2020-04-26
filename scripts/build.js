const execa = require('execa')

const target = 'esm'

execa(
  'rollup',
  [
    '-c',
    '--environment',
    [
      `TARGET:${target}`,
      `Mode:production`
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
