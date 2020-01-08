module.exports = {
  presets: [[
    //'@vue/app',
    '@babel/preset-env',
    {
      debug: false,
      useBuiltIns: 'usage'
    }
  ]],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-block-scoping'
  ]
}
