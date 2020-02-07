module.exports = {
  presets: [[
    '@babel/preset-env',
    {
      debug: false,
      useBuiltIns: 'usage',
      corejs: 3
    }
  ]],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-block-scoping',
    '@babel/plugin-proposal-class-properties'
  ]
};
