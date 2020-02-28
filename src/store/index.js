import Vue from 'vue';
import Vuex from 'vuex';

import { getters } from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {},
    balance: 0,
    current: {
      language: '',
      token: 0,
      currencyRate: 0,
    },
    defaultCurrency: 'eur',
    currencies: [
      { value: 'eur', text: 'EUR'},
      { value: 'cny', text: 'YEN'},
      { value: 'usd', text: 'USD'},
    ],
    tips: [],
    tipsOrdering: null,
    isLoggedIn: false,
  },
  getters,
  mutations,
  actions,
  plugins: [],
});
