import Vue from 'vue';
import * as types from './mutation-types';
import { mergeWith } from 'lodash-es';

export default {
  [types.UPDATE_ACCOUNT](state, payload) {
    state.account = payload;
  },
  [types.UPDATE_BALANCE](state, payload) {
    state.balance = payload;
  },
  [types.SWITCH_LOGGED_IN](state, payload) {
    state.isLoggedIn = payload;
  },
  [types.UPDATE_CURRENCY_RATES](state, payload) {
    state.currencyRates = payload;
  },
  [types.UPDATE_TIPS](state, payload) {
    state.tips = payload;
  },
  [types.UPDATE_TOPICS](state, payload) {
    state.topics = payload;
  },
  [types.UPDATE_STATS](state, payload) {
    state.stats = payload;
  },
  [types.SET_TIPS_ORDERING](state, payload) {
    state.tipsOrdering = payload;
  },
  [types.SET_TIPS_SORT_BY](state, payload) {
    state.tipSortBy = payload;
  },
  syncState(state, remoteState) {
    const customizer = (objValue, srcValue) => {
      if (!Array.isArray(srcValue)) return undefined;
      if (!Array.isArray(objValue)) return srcValue;
      return srcValue.map((el, idx) => (
        el && typeof el === 'object' ? mergeWith({}, objValue[idx], el, customizer) : el
      ));
    };
    Object.entries(mergeWith({}, state, remoteState, customizer))
      .forEach(([name, value]) => Vue.set(state, name, value));
  },
};
