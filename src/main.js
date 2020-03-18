import './styles/base.scss';

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import store from './store';
import router from './router'
import { i18n } from './utils/i18nHelper';
import './filters/_globals';

Vue.use(VueRouter);
Vue.use(BootstrapVue)

Vue.config.productionTip = false;

export default new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
