/* globals Cypress */
/* eslint-disable no-unused-vars */
import {
  AeSdk,
  AeSdkAepp,
  BrowserWindowMessageConnection,
  hash,
  MemoryAccount,
  Node,
  walletDetector,
} from '@aeternity/aepp-sdk';
import TIPPING_V1_ACI from 'tipping-contract/generated/Tipping_v1.aci.json';
import TIPPING_V2_ACI from 'tipping-contract/generated/Tipping_v2.aci.json';
import TIPPING_V3_ACI from 'tipping-contract/generated/Tipping_v3.aci.json';
import tippingContractUtil from 'tipping-contract/util/tippingContractUtil';
import FUNGIBLE_TOKEN_ACI from 'aeternity-fungible-token/generated/FungibleTokenFull.aci.json';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFull.aes';
import WORD_REGISTRY_ACI from 'wordbazaar-contracts/generated/WordRegistry.aci.json';
import TOKEN_VOTING_ACI from 'wordbazaar-contracts/generated/TokenVoting.aci.json';
import TOKEN_SALE_ACI from 'wordbazaar-contracts/generated/TokenSale.aci.json';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/generated/TokenSale.aes';
import TOKEN_VOTING_CONTRACT from 'wordbazaar-contracts/generated/TokenVoting.aes';
import BONDING_CURVE from 'sophia-bonding-curve/generated/BondCurveLinear.aes';

import { BigNumber } from 'bignumber.js';
import { shiftDecimalPlaces } from '../../utils';

export default {
  namespaced: true,
  state: {
    sdk: null,
    useSdkWallet: false,
    useIframeWallet: false,
  },
  mutations: {
    setSdk(state, { instance }) {
      state.sdk = instance;
    },
    useSdkWallet(state) {
      state.useSdkWallet = true;
    },
    enableIframeWallet(state) {
      state.useIframeWallet = true;
    },
  },
  actions: {
    async initTippingContract({
      state: {
        sdk,
      },
    }) {
      if (!sdk) throw new Error('Init sdk first');
      // Due to reactivity issues we are not committing the contract instances to the state
      return Promise.all([
        [TIPPING_V1_ACI, process.env.VUE_APP_CONTRACT_V1_ADDRESS],
        [TIPPING_V2_ACI, process.env.VUE_APP_CONTRACT_V2_ADDRESS],
        [TIPPING_V3_ACI, process.env.VUE_APP_CONTRACT_V3_ADDRESS],
      ].map(([tippingInterface, contractAddress]) => (contractAddress
        ? sdk.initializeContract({
          aci: tippingInterface,
          address: contractAddress,
        })
        : null)));
    },
    async initSdk({ dispatch, commit }) {
      const options = {
        nodes: [{ name: 'node', instance: new Node(process.env.VUE_APP_NODE_URL) }],
      };
      if (window.Cypress) {
        const instance = new AeSdk({
          ...options,
          accounts: [
            new MemoryAccount(Cypress.env('privateKey')),
          ],
        });
        instance.addresses = () => ([Cypress.env('publicKey')]);
        commit('setSdk', { instance });
      } else {
        const instance = new AeSdkAepp({
          ...options,
          name: 'Superhero',
          onDisconnect() {
            commit('resetState', null, { root: true });
          },
          async onAddressChange(accounts) {
            const address = Object.keys(accounts.current)[0];
            commit('setAddress', address, { root: true });
            await dispatch('fetchUserInfo', null, { root: true });
          },
        });
        commit('setSdk', { instance });
      }
    },
    async scanForWallets({ commit, state: { sdk } }) {
      let stopScan;
      let resolve = null;
      let rejected = (e) => {
        throw e;
      };
      // eslint-disable-next-line no-underscore-dangle
      const webWalletTimeout = this._vm.$isMobileDevice ? 0
        : setTimeout(() => commit('enableIframeWallet'), 10000);

      async function handleNewWallet({ newWallet }) {
        try {
          clearInterval(webWalletTimeout);
          await sdk.connectToWallet(await newWallet.getConnection());
          await sdk.subscribeAddress('subscribe', 'current');
          const address = sdk.addresses()[0];
          if (!address) return null;
          if (stopScan) stopScan();
          commit('setAddress', address, { root: true });
          if (resolve) return resolve(address);
          return address;
        } catch (e) {
          return rejected(e);
        }
      }

      console.log('Scanning for wallets...');

      const scannerConnection = new BrowserWindowMessageConnection();
      stopScan = walletDetector(scannerConnection, handleNewWallet);

      return new Promise((_resolve, _rejected) => {
        resolve = _resolve;
        rejected = _rejected;
      });
    },
    async getHeight({ state: { sdk } }) {
      return sdk.getHeight();
    },
    async initFungibleTokenContract(
      { commit, state: { sdk } },
      contractAddress,
    ) {
      return sdk
        .initializeContract({
          aci: FUNGIBLE_TOKEN_ACI,
          address: contractAddress,
        });
    },
    async initWordRegistryContract({ commit, state: { sdk } }) {
      return sdk.initializeContract({
        aci: WORD_REGISTRY_ACI,
        address: process.env.VUE_APP_WORD_REGISTRY_ADDRESS,
      });
    },
    async initTokenVotingContract(
      { commit, state: { sdk } },
      contractAddress,
    ) {
      return sdk.initializeContract({
        aci: TOKEN_VOTING_ACI,
        address: contractAddress,
      });
    },
    async initTokenSaleContract(
      { commit, state: { sdk } },
      contractAddress,
    ) {
      return sdk.initializeContract({
        aci: TOKEN_SALE_ACI,
        address: contractAddress,
      });
    },
    async deployBondingCurve({ state: { sdk } }, decimals) {
      // as we use 18 decimals and thus need to adjust the curve to match that
      const BONDING_CURVE_DECIMALS = BONDING_CURVE.replace(
        'function alpha() : Frac.frac = Frac.make_frac(1, 1)',
        `function alpha() : Frac.frac = Frac.make_frac(1, ${shiftDecimalPlaces(1, decimals)})`,
      );
      const contract = await sdk.initializeContract({ sourceCode: BONDING_CURVE_DECIMALS });
      await contract.init();

      return contract.$options.address;
    },
    async deployTokenSaleContract(
      { commit, state: { sdk } },
      {
        decimals,
        timeout,
        bondingCurveAddress,
        description,
      },
    ) {
      // alters token sale contract to change the dependency default 1 decimals to 18
      // as we want that as default for use with wordbazaar
      const TOKEN_SALE_CONTRACT_DECIMALS = TOKEN_SALE_CONTRACT.replace(
        'let decimals = 1',
        `let decimals = ${shiftDecimalPlaces(1, decimals)}`,
      );

      const contract = await sdk.initializeContract({ sourceCode: TOKEN_SALE_CONTRACT_DECIMALS });
      await contract.init(timeout, bondingCurveAddress, description);
      return contract.$options.address;
    },
    async deployFungibleTokenContract(
      { commit, state: { sdk } },
      {
        name,
        decimals,
        symbol,
        tokenSaleAddress,
      },
    ) {
      const contract = await sdk.initializeContract({ sourceCode: FUNGIBLE_TOKEN_CONTRACT });
      await contract
        .init(name, decimals, symbol, tokenSaleAddress, process.env.VUE_APP_WORD_REGISTRY_ADDRESS);
      return contract.$options.address;
    },
    async deployTokenVotingContract(
      { commit, state: { sdk } },
      {
        metadata,
        closeHeight,
        token,
      },
    ) {
      const contract = await sdk.initializeContract({ sourceCode: TOKEN_VOTING_CONTRACT });
      await contract.init(metadata, closeHeight, token);
      return contract.$options.address;
    },
    async wordRegistryAddToken({ dispatch }, addTokenAddress) {
      const contract = await dispatch('initWordRegistryContract');

      const { decodedResult } = await contract.add_token(addTokenAddress);
      return decodedResult;
    },
    async tokenSaleMethod(
      { dispatch },
      {
        contractAddress,
        method,
        args = [],
        options = {},
      },
    ) {
      const contract = await dispatch('initTokenSaleContract', contractAddress);

      const { decodedResult } = await contract[method](...args, options);
      return decodedResult;
    },
    async tokenVotingMethod(
      { dispatch },
      {
        contractAddress,
        method,
        args = [],
        options = {},
      },
    ) {
      const contract = await dispatch('initTokenVotingContract', contractAddress);

      const { decodedResult } = await contract[method](...args, options);
      return decodedResult;
    },
    async tokenBalance({ dispatch }, { contractAddress, address }) {
      const contract = await dispatch('initFungibleTokenContract', contractAddress);

      const { decodedResult } = await contract.balance(address);
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async tokenTotalSupply({ dispatch }, contractAddress) {
      const contract = await dispatch('initFungibleTokenContract', contractAddress);

      const { decodedResult } = await contract.total_supply();
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async createOrChangeAllowance(
      { dispatch, state: { sdk } },
      { contractAddress, amount, forAccount = null },
    ) {
      const contract = await dispatch('initFungibleTokenContract', contractAddress);

      const { decodedResult } = await contract.allowance({
        from_account: sdk.address,
        for_account: forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
      });

      const allowanceAmount = decodedResult !== undefined
        ? new BigNumber(decodedResult).multipliedBy(-1).plus(amount).toNumber()
        : amount;

      return contract[decodedResult !== undefined ? 'change_allowance' : 'create_allowance'](
        forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
        allowanceAmount,
      );
    },
    async tip({ dispatch }, {
      url,
      title,
      amount,
      tokenAddress = null,
    }) {
      const [contractV1, contractV2] = await dispatch('initTippingContract');

      if (tokenAddress && tokenAddress !== 'native') {
        await dispatch('createOrChangeAllowance', { contractAddress: tokenAddress, amount });

        const { decodedResult } = await contractV2
          .tip_token(url, title, tokenAddress, amount);
        return dispatch('backend/awaitTip', `${decodedResult}_v2`, { root: true });
      }

      if (contractV2) {
        const { decodedResult } = await contractV2.tip(url, title, { amount });
        return dispatch('backend/awaitTip', `${decodedResult}_v2`, { root: true });
      }

      await contractV1.tip(url, title, { amount });
      return dispatch('backend/awaitTip', null, { root: true })
        // TODO: remove after solving https://github.com/aeternity/tipping-community-backend/issues/371
        .catch(console.error);
    },
    async retip({
      dispatch,
    }, {
      contractAddress,
      id,
      amount,
      tokenAddress = null,
    }) {
      const [contractV1, contractV2] = await dispatch('initTippingContract');

      if (tokenAddress && tokenAddress !== 'native') {
        await dispatch('createOrChangeAllowance', { contractAddress: tokenAddress, amount });

        const [tipId, contractVersion] = id.split('_');
        const { decodedResult } = await contractV2
          .retip_token(Number(tipId), tokenAddress, amount);
        return dispatch('backend/awaitRetip', `${decodedResult}_${contractVersion}`, { root: true });
      }

      if (contractAddress === process.env.VUE_APP_CONTRACT_V1_ADDRESS) {
        await contractV1.retip(Number(id.split('_')[0]), { amount });
        return dispatch('backend/awaitRetip', null, { root: true })
          // TODO: remove after solving https://github.com/aeternity/tipping-community-backend/issues/371
          .catch(console.error);
      }

      if (contractAddress === process.env.VUE_APP_CONTRACT_V2_ADDRESS) {
        const [tipId, contractVersion] = id.split('_');
        const { decodedResult } = await contractV2.retip(Number(tipId), { amount });
        return dispatch('backend/awaitRetip', `${decodedResult}_${contractVersion}`, { root: true });
      }

      return null;
    },
    async postWithoutTip({ dispatch }, { title, media }) {
      const contracts = await dispatch('initTippingContract');

      const { decodedResult } = await contracts[2].post_without_tip(title, media);
      return dispatch('backend/awaitTip', `${decodedResult}_v3`, { root: true });
    },
    async postWithoutTipSignature({ state: { sdk } }, { title, media }) {
      const message = tippingContractUtil.postWithoutTippingString(title, media);
      const hashBuffer = hash(message);
      return sdk.signMessage(hashBuffer.toString('hex'), { returnHex: true });
    },
  },
};
