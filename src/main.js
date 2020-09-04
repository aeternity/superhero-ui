import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import { defer } from 'lodash-es';
import VueMeta from 'vue-meta';
import VueTimeago from 'vue-timeago';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n from './utils/i18nHelper';
import registerModals from './views/modals';

Vue.use(VueRouter);
Vue.use(VueMeta);

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
  // https://github.com/egoist/vue-timeago/issues/94#issuecomment-475636750
  converter(date, locale, { includeSeconds = false, addSuffix = false }) {
    // eslint-disable-next-line import/no-extraneous-dependencies,global-require
    const distanceInWordsStrict = require('date-fns/distance_in_words_strict');
    return distanceInWordsStrict(Date.now(), date, { locale, addSuffix, includeSeconds });
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

registerModals();
sync(store, router);

store.watch(
  ({ isBackendLive }) => isBackendLive,
  async (isBackendLive) => {
    const targetRouteName = isBackendLive ? 'feed' : 'maintenance';
    if (router.currentRoute.name === targetRouteName) return;
    await router.push({ name: targetRouteName });
  },
);

export default new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
