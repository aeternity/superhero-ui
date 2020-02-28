import * as types from './mutation-types';

export default {
  setAccount({ commit }, payload) {
    commit(types.UPDATE_ACCOUNT, payload);
    commit(types.UPDATE_BALANCE);
  },
  updateCurrencyRates({ commit }, payload) {
    commit(types.CURRENCY_RATES, payload)
  },
  updateTips({ commit }, payload) {
    commit(types.UPDATE_TIPS, payload)
  },
  updateTopics({ commit }, payload) {
    commit(types.UPDATE_TOPICS, payload)
  },
  updateStats({ commit }, payload) {
    commit(types.UPDATE_STATS, payload)
  },
  setTipOrdering({ commit }, payload) {
    commit(types.SET_TIPS_ORDERING, payload)
  },
  reloadTips({ commit }) {
    commit(types.RELOAD_TIPS)
  }
};
