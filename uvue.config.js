export default {
  plugins: [
    '@uvue/core/plugins/prefetch',
    '../../src/utils/uvueVuexPlugin',
  ],
  paths: {
    template: 'public/ssr.html',
  },
};
