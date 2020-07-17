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
    userComments: {},
    tip: {},
    comment: {},
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
    setUserComments({ userComments }, { address, value }) {
      Vue.set(userComments, address, value);
    },
    setTip({ tip }, { id, value }) {
      Vue.set(tip, id, value);
    },
    setComment({ comment }, { id, value }) {
      Vue.set(comment, id, value);
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
    async reloadUserComments({ commit }, address) {
      commit('setUserComments', {
        address,
        value: (await Backend.getUserComments(address))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      });
    },
    async reloadTip({ commit, rootState: { chainNames } }, id) {
      const [tip, comments] = await Promise.all([
        Backend.getCacheTipById(id),
        Backend.getTipComments(id),
      ]);
      commit('setTip', {
        id,
        value: {
          ...tip,
          comments: comments.map((comment) => ({
            ...comment,
            chainName: chainNames[comment.author],
          })),
        },
      });
    },
    async reloadComment({ commit }, id) {
      commit('setComment', { id, value: await Backend.getCommentById(id) });
    },
  },
};
