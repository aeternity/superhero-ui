import * as types from './mutation-types';
import { EventBus } from '../utils/eventBus';

export default {
  setLoggedInAccount({ commit }, payload) {
    commit(types.SWITCH_LOGGED_IN, true);
    commit(types.UPDATE_ACCOUNT, payload.account);
    commit(types.UPDATE_BALANCE, payload.balance);
  },
  updateCurrencyRates({ commit }, payload) {
    commit(types.UPDATE_CURRENCY_RATES, payload);
    if (payload.aeternity && payload.aeternity.usd) {
      commit(types.SET_MIN_TIP_AMOUNT, +(0.01 * (1 / payload.aeternity.usd)).toFixed(2));
    }
  },
  updateTopics({ commit }, payload) {
    commit(types.UPDATE_TOPICS, payload);
  },
  updateStats({ commit }, payload) {
    commit(types.UPDATE_STATS, payload);
  },
  setTipSortBy({ commit }, payload) {
    commit(types.SET_TIPS_SORT_BY, payload);
    EventBus.$emit('setTipSortBy');
  },
  setOracleState({ commit }, payload) {
    commit(types.SET_ORACLE_STATE, payload);
  },
  addLoading({ commit, state }, payload) {
    state.loading[payload] = true;
    commit(types.SET_LOADING, state.loading);
  },
  removeLoading({ commit, state }, payload) {
    state.loading[payload] = false;
    commit(types.SET_LOADING, state.loading);
  },
  setChainNames({ commit }, payload) {
    commit(types.SET_CHAIN_NAMES, payload);
  },
  setWizardCurrentStep({ commit }, payload) {
    commit(types.SET_WIZARD_CURRENT_STEP, payload * 1);
  },
  setWizardIsCollapsed({ commit }, payload) {
    commit(types.SET_WIZARD_IS_COLLAPSED, Boolean(payload));
  },
  toggleTipModal({ commit }, payload) {
    commit(types.TOGGLE_TIP_MODAL, Boolean(payload));
  },
  updateCurrency({ commit }, payload) {
    commit(types.UPDATE_CURRENCY, payload);
  },
  updateBalance({ commit }, payload) {
    commit(types.UPDATE_BALANCE, payload);
  },
};
