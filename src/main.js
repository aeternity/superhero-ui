import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import { defer } from 'lodash-es';
import VueMeta from 'vue-meta';
import VueTimeago from 'vue-timeago';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import fetch from 'node-fetch';
import App from './App.vue';
import createStore from './store';
import setupClientState from './store/plugins/setupClientState';
import createRouter from './router';
import i18n from './utils/i18nHelper';
import registerModals from './views/modals';

if (process.env.VUE_CLI_SSR) {
  global.fetch = fetch;
}

Vue.use(VueRouter);
Vue.use(VueMeta);

Vue.use(VueTimeago, {
  locale: 'en',
  // https://github.com/egoist/vue-timeago/issues/94#issuecomment-475636750
  converter(date, locale, { includeSeconds = false, addSuffix = false }) {
    return formatDistanceStrict(Date.now(), date, { locale, addSuffix, includeSeconds });
  },
});

Vue.config.productionTip = false;

Vue.prototype.$watchUntilTruly = function watchUntilTruly(getter) {
  return new Promise((resolve) => {
    const unwatch = this.$watch(
      getter,
      (value) => {
        if (!value) return;
        resolve();
        defer(() => unwatch());
      },
      { immediate: true },
    );
  });
};

if (!('$location' in Vue.prototype)) {
  Object.defineProperty(Vue.prototype, '$location', {
    get() {
      if (!process.env.VUE_CLI_SSR) return new URL(window.location);
      const { host } = this.$context.req.headers;
      const isHttp = /^\w+:\d+$/.test(host);
      return new URL(`http${isHttp ? '' : 's'}://${host}${this.$context.url}`);
    },
  });
  Object.defineProperty(Vue.prototype, '$userAgent', {
    get() {
      return process.env.VUE_CLI_SSR
        ? this.$context.req.headers['user-agent'] || ''
        : window.navigator.userAgent;
    },
  });
  Object.defineProperty(Vue.prototype, '$isMobileDevice', {
    get() {
      return this.$userAgent.includes('Mobi');
    },
  });
}

registerModals();

export default () => {
  const store = createStore();
  const router = createRouter();

  sync(store, router);

  if (!process.env.VUE_CLI_SSR) {
    setupClientState(store);
  }

  return new Vue({
    store,
    router,
    i18n,
    render: (h) => h(App),
  });
};
