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
        additionalData: `
          @import "${path.resolve(__dirname, 'src/styles/variables.scss')}";
          @import "${path.resolve(__dirname, 'src/styles/mixins.scss')}";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('favicons')
      .use(FaviconsWebpackPlugin, [{
        logo: path.resolve(__dirname, 'src/assets/favicon.svg'),
        publicPath: '/',
        favicons: {
          start_url: '/',
          appName: 'Superhero',
          appDescription: 'Social platform with a mission',
          developerName: 'Aeternity Developers',
          developerURL: 'https://github.com/aeternity/superhero-ui',
          background: '#1c1c24',
          theme_color: '#1c1c24',
          icons: {
            firefox: { offset: 15 },
          },
        },
      }])
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
      .resolve.alias
      .delete('@')
      .set('core-js-pure', 'core-js')
      .set('lodash', 'lodash-es')
      .set('js-yaml', 'empty-module')
      .parent.parent
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
      .oneOf('skip-optimize')
      .resourceQuery(/skip-optimize/)
      .use('svg-url-loader')
      .loader('svg-url-loader')
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
