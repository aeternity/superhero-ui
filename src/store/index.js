import Vue from 'vue';
import Vuex from 'vuex';
import BigNumber from 'bignumber.js';
import Swagger from '@aeternity/aepp-sdk/es/utils/swagger';
import { camelCase } from 'lodash-es';
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
    wordRegistry: [],
    isHiddenContent: true,
    isBackendLive: true,
    cookiesConsent: {},
    middleware: null,
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
    async getTokenBalance({ state: { address, middleware } }, contractAddress) {
      const result = await middleware.getAex9Balance(contractAddress, address);
      return new BigNumber(result.amount || 0).toFixed();
    },
    async updateTokensBalanceAndPrice({ state: { address }, commit, dispatch }) {
      await dispatch('initMiddleware');
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
            price: await Backend.getWordSaleDetailsByToken(token)
              .then((s) => s.buyPrice).catch(() => null),
          });
        }
      }));
    },
    async initMiddleware({ commit }) {
      const res = await fetch(`${process.env.VUE_APP_MIDDLEWARE_URL}/swagger/swagger.json`);
      const swag = await res.json();

      swag.paths = {
        ...swag.paths,
        'aex9/balance/{token}/{account}?top=true': {
          get: {
            operationId: 'getAex9Balance',
            parameters: [
              {
                in: 'path',
                name: 'token',
                required: true,
                type: 'string',
              },
              {
                in: 'path',
                name: 'account',
                required: true,
                type: 'string',
              },
            ],
          },
        },
      };

      const { api: middleware } = await Swagger.compose({
        methods: {
          urlFor: (path) => `${process.env.VUE_APP_MIDDLEWARE_URL}/${path}`,
          axiosError: () => '',
        },
      })({ swag });
      commit('setMiddleware', Object.entries(middleware).reduce((m, [k, v]) => ({ ...m, [camelCase(k)]: v }), {}));
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
        selectedCurrency, address, balance, tokenInfo, tokenBalances,
        tokenPrices, wordRegistry, cookiesConsent,
      }) => ({
        selectedCurrency,
        address,
        balance,
        tokenInfo,
        tokenBalances,
        tokenPrices,
        wordRegistry,
        cookiesConsent,
      }),
    ),
    modals,
  ],
});
