import Vue from 'vue';
import Vuex from 'vuex';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import BigNumber from 'bignumber.js';
import mutations from './mutations';
import getters from './getters';
import persistState from './plugins/persistState';
import modals from './plugins/modals';
// eslint-disable-next-line import/no-cycle
import backend from './modules/backend';
import aeternity from './modules/aeternity';
// eslint-disable-next-line import/no-cycle
import Backend from '../utils/backend';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    address: null,
    balance: 0,
    profile: {},
    pinnedItems: [],
    selectedCurrency: 'eur',
    topics: [],
    tipSortBy: 'hot',
    oracleState: {},
    chainNames: [],
    verifiedUrls: [],
    graylistedUrls: [],
    tokenInfo: {},
    tokenBalances: [],
    tokenPrices: {},
    isHiddenContent: true,
    isBackendLive: true,
    cookiesConsent: {},
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
    async getTokenBalance({ state: { address, aeternity: { sdk } } }, contractAddress) {
      const tokenContract = await sdk
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress });
      const { decodedResult } = await tokenContract.methods.balance(address);
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async updateTokensBalanceAndPrice({ state: { address }, commit, dispatch }) {
      const tokens = await Backend.getTokenBalances(address);
      await Promise.all(Object.entries(tokens).map(async ([token]) => {
        commit('addTokenBalance', {
          token,
          balance: await dispatch('getTokenBalance', token),
        });
        commit('addTokenPrice', {
          token,
          price: await Backend.getWordSaleDetailsByToken(token)
            .then((s) => s.buyPrice).catch(() => null),
        });
      }));
    },
  },
  getters,
  modules: {
    backend,
    aeternity,
  },
  plugins: [
    persistState(
      (state) => state,
      ({
        selectedCurrency, address, balance, tokenInfo, tokenBalances, tokenPrices, cookiesConsent,
      }) => ({
        selectedCurrency,
        address,
        balance,
        tokenInfo,
        tokenBalances,
        tokenPrices,
        cookiesConsent,
      }),
    ),
    modals,
  ],
});
