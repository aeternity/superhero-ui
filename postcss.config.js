module.exports = {
  parser: 'postcss',
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano')({
      'preset': [
        'default',
        { 'discardComments': { 'removeAll': true } }
      ]
    })
  ]
}
