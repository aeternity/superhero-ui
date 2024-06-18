import Vue from 'vue';
import Vuex from 'vuex';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import mutations from './mutations';
import getters from './getters';
import modals from './plugins/modals';
import backend from './modules/backend';
import aeternity from './modules/aeternity';
import Backend from '../utils/backend';

Vue.use(Vuex);

export default () => new Vuex.Store({
  state: {
    address: null,
    balance: 0,
    profile: {},
    pinnedItems: [],
    selectedCurrency: 'eur',
    chainNames: [],
    verifiedUrls: [],
    graylistedUrls: [],
    tokenInfo: {},
    tokenBalances: [],
    tokenPrices: {},
    wordRegistry: [],
    isHiddenContent: true,
    cookiesConsent: {},
    ssrTime: 'SH_SSR_TIME',
  },
  mutations,
  actions: {
    async updateUserProfile({ commit, state: { address } }) {
      commit('setUserProfile', await Backend.getProfile(address));
    },
    async updatePinnedItems({ commit, state: { address } }) {
      commit('setPinnedItems', await Backend.getPinnedItems(address));
    },
    async updateCookiesConsent({ commit, dispatch }) {
      dispatch('backend/callWithAuth', { method: 'getCookiesConsent' })
        .then((list) => list.forEach(({ scope, status }) => commit('setCookiesConsent', { scope, status: status === 'ALLOWED' })));
    },
    async getTokenBalance({ state: { address } }, contractAddress) {
      const result = await axios.get(`${process.env.VUE_APP_MIDDLEWARE_URL}/aex9/balance/${contractAddress}/${address}`);
      return new BigNumber(result.data.amount || 0).toFixed();
    },
    async updateTokensBalanceAndPrice({ state: { address }, commit, dispatch }) {
      const tokens = await Backend.getTokenBalances(address);
      const knownTokens = (await Backend.getWordRegistry()).map((item) => item.tokenAddress);
      await Promise.all(Object.entries(tokens).map(async ([token]) => {
        commit('addTokenBalance', {
          token,
          balance: await dispatch('getTokenBalance', token),
        });
        if (knownTokens.includes(token)) {
          commit('addTokenPrice', {
            token,
            price: await Backend.getWordSaleDetailsByToken(token).then((s) => s.buyPrice),
          });
        }
      }));
    },
    async fetchUserInfo({ dispatch, commit, state: { address, aeternity: { sdk } } }) {
      if (!address) return;
      await Promise.all([
        dispatch('updatePinnedItems'),
        dispatch('updateUserProfile'),
        (async () => {
          const balance = await sdk.getBalance(address);
          commit('updateBalance', balance);
        })(),
        dispatch('updateTokensBalanceAndPrice'),
      ]);
    },
  },
  getters,
  modules: {
    backend,
    aeternity,
  },
  plugins: [
    modals,
  ],
});
