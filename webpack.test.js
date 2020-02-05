const merge = require('webpack-merge');
const production = require('./webpack.prod.js');
const webpack = require('webpack');

module.exports = merge(production,  {
  plugins: [
    new webpack.EnvironmentPlugin(['PRIVATE_KEY', 'PUBLIC_KEY'])
  ]
});
