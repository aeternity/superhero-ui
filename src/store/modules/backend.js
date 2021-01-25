/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import Vue from 'vue';
import { times } from 'lodash-es';
// eslint-disable-next-line import/no-cycle
import { createDeepLinkUrl } from '../../utils';

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
    stats: null,
    prices: {},
  },
  getters: {
    minTipAmount: ({ prices: { usd } }) => 0.01 / usd,
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
    setStats(state, stats) {
      state.stats = stats;
    },
    setPrices(state, prices) {
      state.prices = prices;
    },
  },
  actions: {
    async reloadTips({ commit, dispatch, state: { tipsPageCount, tipsReloading } }, args) {
      if (tipsReloading[args]) return;
      commit('tipsReloading', args);
      const value = (await Promise.all(
        times(tipsPageCount[args], (p) => dispatch('getCacheFeed', p + 1, ...args)),
      )).flat().filter((p) => p);
      commit('setTips', { args, value });
    },
    async loadNextPageOfTips({ commit, dispatch, state }, args) {
      if (state.tipsEndReached[args] || state.tipsNextPageLoading[args]) return;
      commit('tipsNextPageLoading', args);
      const value = await dispatch('getCacheFeed', state.tipsPageCount[args] + 1, ...args);
      commit('addTips', { args, value });
    },
    async reloadUserComments({ commit, dispatch }, address) {
      commit('setUserComments', {
        address,
        value: (await dispatch('getUserComments', address))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      });
    },
    async reloadTip({ commit, dispatch, rootState: { chainNames } }, id) {
      const [tip, comments] = await Promise.all([
        dispatch('getCacheTipById', id),
        dispatch('getTipComments', id),
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
    async reloadComment({ commit, dispatch }, id) {
      commit('setComment', { id, value: await dispatch('getCommentById', id) });
    },
    async reloadStats({ commit, dispatch, rootState: { aeternity: { sdk } } }) {
      const [stats1, stats2, height] = await Promise.all([
        dispatch('getCacheStats'),
        dispatch('getStats'),
        sdk.height(),
      ]);
      commit('setStats', { ...stats1, ...stats2, height });
    },
    async reloadPrices({ commit, dispatch }) {
      commit('setPrices', (await dispatch('getPrice'))?.aeternity);
    },
    // eslint-disable-next-line consistent-return
    async callWithAuth({
      dispatch,
      rootState: {
        aeternity: {
          useSdkWallet,
          sdk,
        },
        address,
      },
    }, { method, arg, to }) {
      const { challenge } = await dispatch(method, address, arg);
      if (useSdkWallet) {
        const signature = await sdk.signMessage(challenge);
        const response = await dispatch(method, address, { challenge, signature });
        return response;
      }

      const url = new URL(to || window.location, window.location);
      url.search = '';
      window.location = createDeepLinkUrl({
        type: 'sign-message',
        message: challenge,
        'x-success': `${url}?method=${method}&address=${address}&challenge=${challenge}&signature={signature}`,
      });
    },
    async sendComment(
      { dispatch, rootState: { address, aeternity: { useSdkWallet } } },
      { tipId, text, parentId },
    ) {
      if (!useSdkWallet) {
        window.location = createDeepLinkUrl({
          type: 'comment', id: tipId, text, parentId,
        });
        return;
      }
      await dispatch('callWithAuth', {
        method: 'sendTipComment',
        arg: {
          tipId, text, author: address, parentId,
        },
      });
      await Promise.all([
        dispatch('reloadTip', tipId),
        ...parentId ? [dispatch('reloadComment', parentId)] : [],
        dispatch('reloadStats'),
      ]);
    },
    async setCookies({ dispatch, commit }, { scope, status }) {
      await dispatch('callWithAuth', {
        method: 'setCookiesConsent',
        arg: { scope, status },
      });
      commit('setCookiesConsent', { scope, status }, { root: true });
    },
    async wrapTry({ commit }, promise) {
      try {
        return promise.then((res) => {
          if (!res) {
            commit('setBackendStatus', false, { root: true });
            return null;
          }
          commit('setBackendStatus', true, { root: true });
          if (!res.ok) throw new Error(`Request failed with ${res.status}`);
          return res.json();
        }).catch((error) => {
          console.error(error);
          return null;
        });
      } catch (err) {
        commit('setBackendStatus', false, { root: true });
        return null;
      }
    },
    backendFetch: ({ dispatch }, path, ...args) => dispatch(
      'wrapTry',
      fetch(`${process.env.VUE_APP_BACKEND_URL}/${path}`, ...args).catch((err) => console.error(err)),
    ),
    getTipComments: async ({ dispatch }, tipId) => dispatch('backendFetch', `comment/api/tip/${encodeURIComponent(tipId)}`),
    sendTipComment: async ({ dispatch }, _, postParam) => dispatch(
      'backendFetch',
      'comment/api/', {
        method: 'post',
        body: JSON.stringify(postParam),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    getUserComments: async ({ dispatch }, address) => dispatch('backendFetch', `comment/api/author/${address}`),
    pinItem: async ({ dispatch }, address, postParam) => dispatch('backendFetch', `pin/${address}`, {
      method: 'post',
      body: JSON.stringify(postParam),
      headers: { 'Content-Type': 'application/json' },
    }),
    unPinItem: async ({ dispatch }, address, postParam) => dispatch(
      'backendFetch',
      `pin/${address}`, {
        method: 'delete',
        body: JSON.stringify(postParam),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    getPinnedItems: async ({ dispatch }, address) => dispatch('backendFetch', `pin/${address}`),
    getProfile: async ({ dispatch }, address) => dispatch('backendFetch', `profile/${address}`),
    sendProfileData: async ({ dispatch }, address, postParam) => dispatch(
      'backendFetch',
      `profile/${address}`, {
        method: 'post',
        ...postParam instanceof FormData
          ? { body: postParam }
          : {
            body: JSON.stringify(postParam),
            headers: { 'Content-Type': 'application/json' },
          },
      },
    ),
    setImage: async ({ dispatch }, address, data) => {
      const request = {
        method: 'post',
        body: data,
      };
      return dispatch('backendFetch', `profile/${address}`, request);
    },
    claimFromUrl: async ({ dispatch }, postParam) => dispatch(
      'backendFetch',
      'claim/submit', {
        method: 'post',
        body: JSON.stringify(postParam),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    sendPostReport: async ({ dispatch }, author, postParam) => dispatch(
      'backendFetch',
      'blacklist/api/wallet', {
        method: 'post',
        body: JSON.stringify({ ...postParam, author }),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    getProfileImageUrl: (_, address) => `${process.env.VUE_APP_BACKEND_URL}/profile/image/${address}`,
    getStats: async ({ dispatch }) => dispatch('backendFetch', 'static/stats/'),
    getCacheTipById: async ({ dispatch }, id) => dispatch('backendFetch', `cache/tip?id=${id}`),
    getCacheUserStats: async ({ dispatch }, address) => dispatch('backendFetch', `cache/userStats?address=${address}`),
    getCacheFeed: async (
      { dispatch },
      page,
      ordering,
      address = null,
      search = null,
      blacklist = true,
      tips = true,
      posts = true,
    ) => {
      let query = `?ordering=${ordering}&page=${page}`;
      if (tips) query += '&contractVersion=v1&contractVersion=v2';
      if (posts) query += '&contractVersion=v3';
      if (address) query += `&address=${address}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      query += `&blacklist=${blacklist}`;
      // soon change 'tips' to 'feed'
      return dispatch('backendFetch', `cache/tips${query}`);
    },
    getCacheStats: async ({ dispatch }) => dispatch('backendFetch', 'cache/stats'),
    getCacheChainNames: async ({ dispatch }) => dispatch('backendFetch', 'cache/chainnames'),
    getPrice: async ({ dispatch }) => dispatch('backendFetch', 'cache/price'),
    getOracleCache: async ({ dispatch }) => dispatch('backendFetch', 'cache/oracle'),
    getTopicsCache: async ({ dispatch }) => dispatch('backendFetch', 'cache/topics'),
    getTokenInfo: async ({ dispatch }) => dispatch('backendFetch', 'tokenCache/tokenInfo'),
    getTokenBalances: async ({ dispatch }, address) => dispatch('backendFetch', `tokenCache/balances?address=${address}`),
    getWordSaleDetailsByToken: async ({ dispatch }, address) => dispatch('backendFetch', `tokenCache/wordSaleByToken?address=${address}`),
    cacheInvalidateTips: async ({ dispatch }) => dispatch('backendFetch', 'cache/invalidate/tips'),
    getCommentCountForAddress: async ({ dispatch }, address) => dispatch('backendFetch', `comment/count/author/${address}`),
    getTipPreviewUrl: (_, previewLink) => `${process.env.VUE_APP_BACKEND_URL}${previewLink}`,
    getCommentById: async ({ dispatch }, id) => dispatch('backendFetch', `comment/api/${id}`),
    getVerifiedUrls: async ({ dispatch }) => dispatch('backendFetch', 'verified'),
    getGrayListedUrls: async ({ dispatch }) => dispatch('backendFetch', 'static/wallet/graylist'),
    getTipTraceBackend: ({ dispatch }, id) => dispatch('backendFetch', `tracing/backend?id=${id}`),
    getTipTraceBlockchain: ({ dispatch }, id) => dispatch('backendFetch', `tracing/blockchain?id=${id}`),
    getCookiesConsent: async ({ dispatch }, address, query) => dispatch(
      'backendFetch',
      `consent/${address}${query ? `?challenge=${query.challenge}&signature=${query.signature}` : ''}`,
    ),
    setCookiesConsent: async ({ dispatch }, address, { scope, status }) => dispatch(
      'backendFetch',
      `consent/${address}/${scope}`, {
        method: 'post',
        body: JSON.stringify({ status: status ? 'ALLOWED' : 'REJECTED' }),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    sendPostWithoutTip: async ({ dispatch }, postParam) => dispatch(
      'backendFetch',
      'payfortx/post', {
        method: 'post',
        body: JSON.stringify(postParam),
        headers: { 'Content-Type': 'application/json' },
      },
    ),
  },
};
