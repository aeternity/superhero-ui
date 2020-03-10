export const getters = {
  account(state) {
    return state.account;
  },
  balance(state) {
    return state.balance;
  },
  settings(state) {
    return state.settings;
  },
  isLoggedIn(state) {
    return state.isLoggedIn;
  },
  tips(state) {
    return state.tips;
  },
  topics(state) {
    return state.topics;
  },
  stats(state) {
    return state.stats;
  },
  tipsOrdering(state) {
    return state.tipsOrdering;
  },
  tipSortBy(state) {
    return state.tipSortBy;
  },
  currencyRates(state) {
    return state.currencyRates;
  },
  oracleState(state) {
    return state.oracleState;
  },
  loading(state) {
    return state.loading;
  },
  chainNames(state) {
    return state.chainNames;
  }
};
