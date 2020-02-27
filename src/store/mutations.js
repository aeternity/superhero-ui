import * as types from './mutation-types';

export default {
  [types.UPDATE_ACCOUNT](state, payload) {
    state.account = payload;
  },
  [types.UPDATE_BALANCE](state, payload) {
    state.balance = payload;
  },
  [types.SWITCH_NETWORK](state, payload) {
    state.current.network = payload;
  },
  [types.SWITCH_LOGGED_IN](state, payload) {
    state.isLoggedIn = payload;
  },
  [types.SET_WALLET](state, payload) {
    state.wallet = payload;
  },
  [types.SET_ACTIVE_ACCOUNT](state, payload) {
    state.account.publicKey = payload.publicKey;
    state.activeAccount = payload.index;
  },
  [types.SET_USERNETWORK](state, payload) {
    state.userNetworks.push(payload);
  },
  [types.SET_USERNETWORKS](state, payload) {
    state.userNetworks = payload;
  },
  [types.INIT_SDK](state, payload) {
    state.sdk = payload;
  },
  [types.SET_MAIN_LOADING](state, payload) {
    state.mainLoading = payload;
  },
  [types.SET_NODE_STATUS](state, payload) {
    state.nodeStatus = payload;
  },
  [types.SET_CURRENCY](state, { currency, currencyRate }) {
    state.current.currency = currency;
    state.current.currencyRate = currencyRate;
  },
  [types.SET_CURRENCIES](state, payload) {
    state.currencies = payload;
  },
};
