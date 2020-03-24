import './styles/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue } from 'bootstrap-vue';
import VueClipboard from 'vue-clipboard2';
import SocialSharing from 'vue-social-sharing';
import App from './App.vue';
import store from './store';
import router from './router';
import { i18n } from './utils/i18nHelper';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueClipboard);
Vue.use(SocialSharing);

Vue.config.productionTip = false;

export default new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
