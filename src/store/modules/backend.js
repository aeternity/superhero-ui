/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import Vue from 'vue';
import { times } from 'lodash-es';
import Backend from '../../utils/backend';

export default {
  namespaced: true,
  state: {
    tips: {},
    tipsPageCount: {},
    tipsReloading: {},
    tipsNextPageLoading: {},
    tipsEndReached: {},
  },
  mutations: {
    setTips({ tips, tipsReloading }, { args, value }) {
      Vue.set(tips, args, value);
      tipsReloading[args] = false;
    },
    addTips({
      tips, tipsPageCount, tipsEndReached, tipsNextPageLoading,
    }, { args, value }) {
      if (value.length) {
        tips[args].push(...value);
        tipsPageCount[args] += 1;
      } else Vue.set(tipsEndReached, args, true);
      tipsNextPageLoading[args] = false;
    },
    tipsReloading({ tipsReloading, tipsPageCount }, args) {
      Vue.set(tipsReloading, args, true);
      if (!tipsPageCount[args]) Vue.set(tipsPageCount, args, 1);
    },
    tipsNextPageLoading({ tipsNextPageLoading, tipsPageCount }, args) {
      Vue.set(tipsNextPageLoading, args, true);
      if (!tipsPageCount[args]) Vue.set(tipsPageCount, args, 1);
    },
  },
  actions: {
    async reloadTips({ commit, state: { tipsPageCount, tipsReloading } }, args) {
      if (tipsReloading[args]) return;
      commit('tipsReloading', args);
      const value = (await Promise.all(
        times(tipsPageCount[args], (p) => Backend.getCacheTips(p + 1, ...args)),
      )).flat();
      commit('setTips', { args, value });
    },
    async loadNextPageOfTips({ commit, state }, args) {
      if (state.tipsEndReached[args] || state.tipsNextPageLoading[args]) return;
      commit('tipsNextPageLoading', args);
      const value = await Backend.getCacheTips(state.tipsPageCount[args] + 1, ...args);
      commit('addTips', { args, value });
    },
  },
};
