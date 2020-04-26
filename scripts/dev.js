const execa = require('execa')

const target = 'browerEsm'

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
