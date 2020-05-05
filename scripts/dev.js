const execa = require('execa')

const target = 'es'
process.env.NODE_ENV = 'development'
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
