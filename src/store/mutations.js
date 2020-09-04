import Vue from 'vue';
import { mergeWith } from 'lodash-es';

export default {
  setAddress(state, address) {
    state.address = address;
  },
  resetState(state) {
    state.useSdkWallet = false;
    state.address = null;
    state.balance = 0;
    state.profile = {};
    state.cookiesConsent = {};
  },
  updateTopics(state, payload) {
    state.topics = payload;
  },
  setTipSortBy(state, payload) {
    state.tipSortBy = payload;
  },
  setOracleState(state, payload) {
    state.oracleState = payload;
  },
  setChainNames(state, payload) {
    state.chainNames = payload;
  },
  updateCurrency(state, payload) {
    state.selectedCurrency = payload;
  },
  updateBalance(state, payload) {
    state.balance = payload;
  },
  setGraylistedUrls(state, payload) {
    state.graylistedUrls = payload;
  },
  setTokenInfo(state, payload) {
    state.tokenInfo = payload;
  },
  setVerifiedUrls(state, payload) {
    state.verifiedUrls = payload;
  },
  setIsHiddenContent(state, payload) {
    state.isHiddenContent = payload;
  },
  useSdkWallet(state) {
    state.useSdkWallet = true;
  },
  enableIframeWallet(state) {
    state.useIframeWallet = true;
  },
  setUserProfile(state, profile) {
    state.profile = profile;
  },
  addTokenBalance(state, payload) {
    state.tokenBalances = [payload, ...state.tokenBalances]
      .filter((bal, idx, arr) => !arr.slice(0, idx).some((b) => b.token === bal.token))
      .sort((a, b) => a.token.localeCompare(b.token));
  },
  addTokenPrice(state, payload) {
    const { tokenPrices } = state;
    tokenPrices[payload.token] = payload.price;
    state.tokenPrices = tokenPrices;
  },
  setPinnedItems(state, pinnedItems) {
    state.pinnedItems = pinnedItems;
  },
  syncState(state, remoteState) {
    const customizer = (objValue, srcValue) => {
      if (!Array.isArray(srcValue)) return undefined;
      if (!Array.isArray(objValue)) return srcValue;
      return srcValue.map((el, idx) => (
        el && typeof el === 'object' ? mergeWith({}, objValue[idx], el, customizer) : el
      ));
    };
    Object.entries(mergeWith({}, state, remoteState, customizer))
      .forEach(([name, value]) => Vue.set(state, name, value));
  },
  setSdk(state, sdk) {
    state.sdk = sdk;
  },
  setBackendStatus(state, isBackendLive) {
    state.isBackendLive = isBackendLive;
  },
  setCookiesConsent(state, { scope, status }) {
    Vue.set(state.cookiesConsent, scope, status);
  },
};
