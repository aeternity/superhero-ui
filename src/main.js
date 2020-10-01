import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n from './utils/i18nHelper';
import registerModals from './views/modals';

Vue.use(VueRouter);

Vue.config.productionTip = false;

registerModals();
sync(store, router);

store.watch(
  ({ isBackendLive }) => isBackendLive,
  async (isBackendLive) => {
    const targetRouteName = isBackendLive ? 'tips' : 'maintenance';
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
