const path = require( 'path' )
const p = path.resolve( __dirname, '../dist' )
console.log( p )
module.exports = {
  // root: path.resolve('./visual'),
  alias: {
    '/vf-modal/': p,
    // '/@/': __dirname,
  },
}