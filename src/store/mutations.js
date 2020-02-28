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
  [types.UPDATE_TIPS](state, payload) {
    state.tips = payload;
  },
  [types.RELOAD_TIPS](state, payload) {
    state.tips = payload;
  },
  [types.SET_TIPS_ORDERING](state, payload) {
    state.tipsOrdering = payload;
  },
};