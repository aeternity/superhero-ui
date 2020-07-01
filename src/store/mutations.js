import Vue from 'vue';
import { mergeWith } from 'lodash-es';

export default {
  setLoggedInAccount(state, { account, balance }) {
    state.account = account;
    state.balance = balance;
  },
  updateCurrencyRates(state, payload) {
    if (payload) {
      state.currencyRates = payload;
      if (payload.aeternity && payload.aeternity.usd) {
        state.minTipAmount = +(0.01 * (1 / payload.aeternity.usd)).toFixed(2);
      }
    }
  },
  resetState(state) {
    state.useSdkWallet = false;
    state.account = null;
    state.balance = 0;
    state.profile = {};
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
  addLoading(state, payload) {
    state.loading[payload] = true;
  },
  removeLoading(state, payload) {
    state.loading[payload] = false;
  },
  setChainNames(state, payload) {
    state.chainNames = payload;
  },
  setWizardCurrentStep(state, payload) {
    state.wizardCurrentStep = payload * 1;
  },
  setWizardIsCollapsed(state, payload) {
    state.wizardIsCollapsed = Boolean(payload);
  },
  updateCurrency(state, payload) {
    state.settings.currency = payload;
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
  useIframeWallet(state) {
    state.useIframeWallet = true;
  },
  setUserProfile(state, profile) {
    state.profile = profile;
  },
  addTokenBalances(state, payload) {
    state.tokenBalances[payload.token] = payload.balance;
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
};
