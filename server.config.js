export default {
  plugins: [
    '@uvue/server/plugins/serverError',
    '@uvue/server/plugins/static',
  ],
  externalsWhitelist: ['lodash-es', /^@aeternity\/aepp-sdk\/es/],
};
