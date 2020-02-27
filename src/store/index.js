import Vue from 'vue';
import Vuex from 'vuex';

import { getters } from './getters';
import mutations from './mutations';
import actions from './actions';
import { networks, DEFAULT_NETWORK } from '../utils/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {},
    wallet: [],
    balance: 0,
    current: {
      network: DEFAULT_NETWORK,
      language: '',
      token: 0,
      currency: 'usd',
      currencyRate: 0,
    },
    network: networks,
    isLoggedIn: false,
    sdk: null,
    mainLoading: true,
    nodeStatus: 'connecting',
    currencies: {},
    notifications: [],
  },
  getters,
  mutations,
  actions,
  plugins: [],
});
