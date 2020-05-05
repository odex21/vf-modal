const execa = require('execa')

const target = 'es'

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
