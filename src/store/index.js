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
    settings: {
      currency: 'eur',
    },
    tips: [],
    topics: {},
    stats: {},
    tipSortBy: 'hot',
    isLoggedIn: false,
    oracleState: {},
    loading: {
      tips: false,
      wallet: false,
      initial: false,
      moreTips: false,
    },
    chainNames: [],
    wizardCurrentStep: 0,
    wizardIsCollapsed: false,
  },
  getters,
  mutations,
  actions,
  plugins: [
    persistState(
      (state) => state,
      ({ settings, wizardCurrentStep, wizardIsCollapsed }) => ({
        settings,
        wizardCurrentStep,
        wizardIsCollapsed,
      }),
    ),
  ],
});
