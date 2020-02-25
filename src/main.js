import './styles/base.scss';

import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import { i18n } from './utils/i18nHelper';

Vue.use(VueRouter);
Vue.use(BootstrapVue)

Vue.config.productionTip = false;

export default new Vue({
  router: router,
  i18n,
  render: h => h(App)
}).$mount('#app')
