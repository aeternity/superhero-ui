/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["context"] }] */

import createApp from './main';

const prepareUrlForRouting = (url) => {
  const { BASE_URL } = process.env;
  return url.startsWith(BASE_URL.replace(/\/$/, ''))
    ? url.substr(BASE_URL.length)
    : url;
};

export default async (context) => {
  const { app, router, store } = createApp();

  await router.push(prepareUrlForRouting(context.url));
  await new Promise((resolve, reject) => router.onReady(resolve, reject));

  context.rendered = () => {
    context.state = store.state;
  };
  return app;
};
