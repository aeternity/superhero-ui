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
  setTipsOrdering({ commit }, payload) {
    console.log("setTipsOrdering", payload);
    commit(types.SET_TIPS_ORDERING, payload)
  },
  setTipSortBy({ commit }, payload) {
    commit(types.SET_TIPS_SORT_BY, payload)
  },
  reloadTips({ commit }) {
    commit(types.RELOAD_TIPS)
  }
};
