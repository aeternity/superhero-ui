import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import persistState from './plugins/persistState';
import modals from './plugins/modals';
// eslint-disable-next-line import/no-cycle
import backend from './modules/backend';
// eslint-disable-next-line import/no-cycle
import Backend from '../utils/backend';

Vue.use(Vuex);

export default () => new Vuex.Store({
  state: {
    address: null,
    balance: 0,
    profile: {},
    pinnedItems: [],
    selectedCurrency: 'eur',
    topics: [],
    tipSortBy: 'hot',
    oracleState: {},
    chainNames: [],
    verifiedUrls: [],
    graylistedUrls: [],
    tokenInfo: {},
    tokenBalances: [],
    isHiddenContent: true,
    useSdkWallet: false,
    useIframeWallet: false,
    sdk: null,
    isBackendLive: true,
    cookiesConsent: { },
  },
  mutations,
  actions: {
    async updateUserProfile({ commit, state: { address } }) {
      commit('setUserProfile', await Backend.getProfile(address));
    },
    async updatePinnedItems({ commit, state: { address } }) {
      commit('setPinnedItems', await Backend.getPinnedItems(address));
    },
    async updateCookiesConsent({ commit, dispatch }) {
      dispatch('backend/callWithAuth', { method: 'getCookiesConsent' })
        .then((list) => list.forEach(({ scope, status }) => commit('setCookiesConsent', { scope, status: status === 'ALLOWED' })));
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
        selectedCurrency, address, balance, tokenInfo, tokenBalances, cookiesConsent,
      }) => ({
        selectedCurrency,
        address,
        balance,
        tokenInfo,
        tokenBalances,
        cookiesConsent,
      }),
    ),
    modals,
  ],
});
