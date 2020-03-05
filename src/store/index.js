import Vue from 'vue';
import Vuex from 'vuex';

import { getters } from './getters';
import mutations from './mutations';
import actions from './actions';
import persistState from './plugins/persistState'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {},
    balance: 0,
    currencyRates: {},
    settings: {
      language: '',
      token: 0,
      currency: 'eur',
    },
    tips: [],
    topics: {},
    stats: {},
    tipsOrdering: null,
    tipSortBy: "highest",
    isLoggedIn: false,
  },
  getters,
  mutations,
  actions,
  plugins: [
    persistState(
      state => state,
      ({ settings }) => ({
        settings,
      })
    )
  ]
});
