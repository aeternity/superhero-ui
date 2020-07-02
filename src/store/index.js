import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import backend from './modules/backend';
import persistState from './plugins/persistState';
import Backend from '../utils/backend';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: null,
    balance: 0,
    profile: {},
    pinnedItems: [],
    currencyRates: {},
    minTipAmount: 0.01,
    settings: {
      currency: 'eur',
    },
    topics: [],
    stats: {},
    tipSortBy: 'hot',
    oracleState: {},
    loading: {
      wallet: false,
      initial: false,
    },
    chainNames: [],
    wizardCurrentStep: 0,
    wizardIsCollapsed: false,
    verifiedUrls: [],
    graylistedUrls: [],
    tokenInfo: {},
    tokenBalances: [],
    isHiddenContent: true,
    useSdkWallet: false,
    useIframeWallet: false,
  },
  mutations,
  actions: {
    async updateUserProfile({ commit, state: { account } }) {
      commit('setUserProfile', await Backend.getProfile(account));
    },
    async updatePinnedItems({ commit, state: { account } }) {
      commit('setPinnedItems', await Backend.getPinnedItems(account));
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.account,
  },
  modules: { backend },
  plugins: [
    persistState(
      (state) => state,
      ({
        settings, wizardCurrentStep, wizardIsCollapsed, account, balance,
      }) => ({
        settings,
        wizardCurrentStep,
        wizardIsCollapsed,
        account,
        balance,
      }),
    ),
  ],
});
