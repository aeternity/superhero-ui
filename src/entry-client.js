import createApp from './main';

const { app, store } = createApp();

store.replaceState(window.__INITIAL_STATE__); // eslint-disable-line no-underscore-dangle
app.$mount('#app');
