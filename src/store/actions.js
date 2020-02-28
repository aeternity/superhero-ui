import * as types from './mutation-types';

export default {
  setAccount({ commit }, payload) {
    commit(types.UPDATE_ACCOUNT, payload);
    commit(types.UPDATE_BALANCE);
  },
  updateTips({ commit }, payload) {
    commit(types.UPDATE_TIPS, payload)
  },
  setTipOrdering({ commit }, payload) {
    commit(types.SET_TIPS_ORDERING, payload)
  },
  reloadTips({ commit }) {
    commit(types.RELOAD_TIPS)
  }
};
