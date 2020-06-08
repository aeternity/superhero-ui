const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

// eslint-disable-next-line camelcase
const { npm_package_version } = process.env;
const commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim();

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        // Global includes - will be prepended in every scss file (including components)
        prependData: `
          @import "@/styles/_variables";
          @import "@/styles/_mixins";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config
      .resolve
      .symlinks(true)
      .end()
      .plugin('favicons')
      .use(FaviconsWebpackPlugin, [{
        logo: path.resolve(__dirname, 'src/assets/favicon.svg'),
        mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
        devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
        publicPath: '/',
        favicons: {
          start_url: '/',
          appName: 'You Do Not Need A Cape To Be A Hero',
          appDescription: 'You Do Not Need A Cape To Be A Hero',
          developerName: 'Aeternity Developers',
          developerURL: 'https://github.com/kenodressel/aepp-boilerplate',
          background: '#ff0d6a',
          theme_color: '#ff0d6a',
          icons: {
            coast: false,
            yandex: false,
            windows: false,
          },
        },
      }])
      .end()
      .plugin('copy')
      .tap((args) => {
        args[0].push({
          from: './node_modules/@aeternity/superhero-button/dist',
          to: './buttons',
          toType: 'dir',
        });
        return args;
      })
      .end()
      .plugin('define')
      .tap((options) => {
        const definitions = { ...options[0] };

        // eslint-disable-next-line camelcase
        if (npm_package_version) {
          definitions['process.env.npm_package_version'] = JSON.stringify(npm_package_version);
        }
        definitions['process.env.COMMIT_HASH'] = JSON.stringify(commitHash);
        return [definitions];
      })
      .end()
      .module
      .rule('aes')
      .test(/\.aes$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();

    config.module.rule('svg')
      .uses.clear().end()
      .oneOf('icon-component')
      .resourceQuery(/icon-component/)
      .use('babel-loader')
      .loader('babel-loader')
      .options({ configFile: false, presets: ['@babel/preset-env'] })
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [{
            addClassesToSVGElement: {
              type: 'full',
              fn(data, options, extra) {
                const svg = data.content[0];
                svg.class.add('icon', path.basename(extra.path, '.svg'));
                return data;
              },
            },
          }],
        },
      })
      .end()
      .end()
      .oneOf('default')
      .use('svg-url-loader')
      .loader('svg-url-loader')
      .options({
        noquotes: true,
        limit: 4096,
        name: 'img/[name].[hash:8].[ext]',
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end();
    return config;
  },
};
