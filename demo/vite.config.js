const path = require('path')

module.exports = {
  alias: {
    '/vf-modal/': path.resolve(__dirname, '../dist'),
    '/@/': path.resolve(__dirname, './src'),
  },
}