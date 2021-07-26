import path from 'path';

export default {
  plugins: [
    ['@uvue/server/plugins/serverError', {
      path: path.join(__dirname, 'public', '500-error.html'),
    }],
    '@uvue/server/plugins/static',
    './src/utils/uvueSsrTimePlugin',
  ],
  externalsWhitelist: ['lodash-es', /^@aeternity\/aepp-sdk\/es/],
};
