export const getters = {
  account(state) {
    return state.account;
  },
  balance(state) {
    return state.balance;
  },
  balanceCurrency({ current, balance }) {
    return (current.currencyRate * balance).toFixed(3);
  },
  current(state) {
    return state.current;
  },
  isLoggedIn(state) {
    return state.isLoggedIn;
  },
  tokenBalance(state) {
    return state.current.token != 0 ? state.tokens[state.current.token].balance.toFixed(3) : state.balance.toFixed(3);
  },
  tokenSymbol() {
    return 'AE';
  },
  currencies({ currencies }) {
    return currencies;
  },
  tips(state) {
    return state.tips;
  },
  topics(state) {
    return state.topics;
  },
  tipsOrdering(state) {
    return state.tipsOrdering;
  },
};
