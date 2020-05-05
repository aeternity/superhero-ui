// eslint-disable-next-line import/prefer-default-export
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
  topics(state) {
    return state.topics;
  },
  stats(state) {
    return state.stats;
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
  },
  wizardCurrentStep(state) {
    return state.wizardCurrentStep;
  },
  wizardIsCollapsed(state) {
    return state.wizardIsCollapsed;
  },
  isTipModalOpen(state) {
    return state.openTipModal;
  },
  minTipAmount(state) {
    return state.minTipAmount;
  },
};
