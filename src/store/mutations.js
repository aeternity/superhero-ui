import Vue from 'vue';
import { mergeWith } from 'lodash-es';
import * as types from './mutation-types';

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
  [types.UPDATE_TOPICS](state, payload) {
    state.topics = payload;
  },
  [types.UPDATE_STATS](state, payload) {
    state.stats = payload;
  },
  [types.SET_TIPS_SORT_BY](state, payload) {
    state.tipSortBy = payload;
  },
  [types.SET_ORACLE_STATE](state, payload) {
    state.oracleState = payload;
  },
  [types.SET_LOADING](state, payload) {
    state.loading = payload;
  },
  [types.SET_CHAIN_NAMES](state, payload) {
    state.chainNames = payload;
  },
  [types.SET_WIZARD_CURRENT_STEP](state, payload) {
    state.wizardCurrentStep = payload;
  },
  [types.SET_WIZARD_IS_COLLAPSED](state, payload) {
    state.wizardIsCollapsed = payload;
  },
  [types.TOGGLE_TIP_MODAL](state, payload) {
    state.openTipModal = payload;
  },
  [types.UPDATE_CURRENCY](state, payload) {
    state.settings.currency = payload;
  },
  [types.SET_MIN_TIP_AMOUNT](state, payload) {
    state.minTipAmount = payload;
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
