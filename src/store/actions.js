import * as types from './mutation-types';

export default {
  setAccount({ commit }, payload) {
    commit(types.UPDATE_ACCOUNT, payload);
    commit(types.UPDATE_BALANCE);
  },
  setAccountName({ commit }, payload) {
    commit(types.SET_ACCOUNT_NAME, payload);
  },
  initSdk({ commit }, payload) {
    commit(types.INIT_SDK, payload);
  },
};
