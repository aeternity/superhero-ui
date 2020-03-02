import * as types from './mutation-types';
import { sort } from './util';

export default {
  setLoggedInAccount({ commit }, payload) {
    commit(types.SWITCH_LOGGED_IN, true);
    commit(types.UPDATE_ACCOUNT, payload.account);
    commit(types.UPDATE_BALANCE, payload.balance);
  },
  updateCurrencyRates({ commit }, payload) {
    commit(types.UPDATE_CURRENCY_RATES, payload)
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
    commit(types.SET_TIPS_ORDERING, payload)
  },
  setTipSortBy({ commit, state }, payload) {
    const tips = sort(payload, state.tips);
    commit(types.SET_TIPS_SORT_BY, payload);
    commit(types.UPDATE_TIPS, tips);
  }
};
