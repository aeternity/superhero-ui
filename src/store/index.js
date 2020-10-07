import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import backend from './modules/backend';
import persistState from './plugins/persistState';
import modals from './plugins/modals';
import Backend from '../utils/backend';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    address: null,
    balance: 0,
    profile: {},
    pinnedItems: [],
    selectedCurrency: 'eur',
    topics: [],
    tipSortBy: 'hot',
    oracleState: {},
    loading: {
      wallet: false,
      initial: false,
    },
    chainNames: [],
    verifiedUrls: [],
    graylistedUrls: [],
    isHiddenContent: true,
    useSdkWallet: false,
    useIframeWallet: false,
    sdk: null,
  },
  mutations,
  actions: {
    async updateUserProfile({ commit, state: { address } }) {
      commit('setUserProfile', await Backend.getProfile(address));
    },
    async updatePinnedItems({ commit, state: { address } }) {
      commit('setPinnedItems', await Backend.getPinnedItems(address));
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.address,
  },
  modules: { backend },
  plugins: [
    persistState(
      (state) => state,
      ({
        selectedCurrency, address, balance,
      }) => ({
        selectedCurrency,
        address,
        balance,
      }),
    ),
    modals,
  ],
});
