import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import store from './store';
import router from './router';
import { i18n } from './utils/i18nHelper';

Vue.use(VueRouter);

Vue.config.productionTip = false;

sync(store, router);

export default new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
