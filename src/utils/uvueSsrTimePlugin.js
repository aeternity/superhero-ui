export default {
  beforeRender(response, context) {
    // eslint-disable-next-line no-param-reassign
    context.shRenderingStartedAt = Date.now();
  },
  rendered(response, context) {
    const time = ((Date.now() - context.shRenderingStartedAt) / 1000).toFixed(2);
    // eslint-disable-next-line no-param-reassign
    response.body = response.body.replace(/SH_SSR_TIME/g, time);
  },
};
