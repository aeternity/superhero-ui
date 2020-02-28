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
      network: {
        url: 'https://mainnet.aeternal.io',
        internalUrl: 'https://mainnet.aeternal.io',
        networkId: 'ae_mainnet',
        middlewareUrl: 'https://mainnet.aeternal.io/',
        explorerUrl: 'https://mainnet.aeternal.io',
        compilerUrl: 'https://compiler.aepps.com',
        tipContract: 'ct_YpQpntd6fi6r3VXnGW7vJiwPYtiKvutUDY35L4PiqkbKEVRqj'
      },
      language: '',
      token: 0,
      currency: 'usd',
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
