import Vue from 'vue';
import Vuex from 'vuex';

import { getters } from './getters';
import mutations from './mutations';
import actions from './actions';
import persistState from './plugins/persistState';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {},
    balance: 0,
    currencyRates: {},
    minTipAmount: 0.01,
    settings: {
      currency: 'eur',
    },
    topics: {},
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
    searchTerm: '',
    isHiddenContent: true,
  },
  getters,
  mutations,
  actions,
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
