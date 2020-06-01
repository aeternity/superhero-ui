import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue } from 'bootstrap-vue';
import { sync } from 'vuex-router-sync';
import VueMeta from 'vue-meta';
import App from './App.vue';
import store from './store';
import router from './router';
import { i18n } from './utils/i18nHelper';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueMeta);


Vue.config.productionTip = false;

sync(store, router);

export default new Vue({
  el: '#app',
  store,
  router,
  i18n,
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  },
  render: (h) => h(App),
}).$mount('#app');
