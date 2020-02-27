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
  currentCurrency({ current }) {
    return current.currency.toUpperCase();
  },
  network(state) {
    return state.network;
  },
  userNetworks(state) {
    return state.userNetworks;
  },
  current(state) {
    return state.current;
  },
  popup(state) {
    return state.popup;
  },
  isLoggedIn(state) {
    return state.isLoggedIn;
  },
  transactions(state) {
    return state.transactions;
  },
  wallet(state) {
    return state.wallet;
  },
  sdk(state) {
    return state.sdk;
  },
  tokenBalance(state) {
    return state.current.token != 0 ? state.tokens[state.current.token].balance.toFixed(3) : state.balance.toFixed(3);
  },
  tokenSymbol() {
    return 'AE';
  },
  mainLoading({ mainLoading }) {
    return mainLoading;
  },
  nodeStatus({ nodeStatus }) {
    return nodeStatus;
  },
  currencies({ currencies }) {
    return currencies;
  },
  notifications({ notifications }) {
    return notifications;
  },
};
