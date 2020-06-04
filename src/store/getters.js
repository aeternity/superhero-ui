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
    return !!state.account;
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
  minTipAmount(state) {
    return state.minTipAmount;
  },
  graylistedUrls(state) {
    return state.graylistedUrls;
  },
  verifiedUrls(state) {
    return state.verifiedUrls;
  },
  searchTerm(state) {
    return state.searchTerm;
  },
  isHiddenContent(state) {
    return state.isHiddenContent;
  },
};
