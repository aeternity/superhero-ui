import './styles/base.scss';

import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import { createStore } from './store';
import { createRouter } from './router';
import i18n from './utils/i18nHelper';
import registerModals from './views/modals';

Vue.use(VueRouter);

Vue.config.productionTip = false;

registerModals();
sync(store, router);

export default async function createApp ({
          beforeApp = () => {},
          afterApp = () => {}
        } = {}) {
          const router = createRouter()



          await beforeApp({
            router,


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


          }

          await afterApp(result)

          return result
        };
