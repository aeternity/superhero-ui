import './styles/base.scss';

import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import { defer } from 'lodash-es';
import App from './App.vue';
import createStore from './store';
import { createRouter } from './router';
import i18n from './utils/i18nHelper';
import registerModals from './views/modals';

// Vue.use(VueRouter);

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

export default async function createApp ({
          beforeApp = () => {},
          afterApp = () => {}
        } = {}) {
          const router = createRouter()
          const store = createStore()


          await beforeApp({
            router,
            store,
          })

          const app = new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: (h) => h(App),
})

          const result = {
            app,
            router,
            store,
          }

          await afterApp(result)

          return result
        };
