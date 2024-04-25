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
// TODO upgrade contracts to acis
import TIPPING_V1_ACI from 'tipping-contract/generated/Tipping_v1.aci.json';
import TIPPING_V2_ACI from 'tipping-contract/generated/Tipping_v2.aci.json';
import TIPPING_V3_ACI from 'tipping-contract/generated/Tipping_v3.aci.json';
import tippingContractUtil from 'tipping-contract/util/tippingContractUtil';
import FUNGIBLE_TOKEN_ACI from 'aeternity-fungible-token/generated/FungibleTokenFull.aci.json';

import { BigNumber } from 'bignumber.js';

export default {
  namespaced: true,
  state: {
    sdk: null,
    useSdkWallet: false,
    useIframeWallet: false,
    wordRegistryContract: null,
    fungibleTokenContracts: {},
    tokenVotingContracts: {},
    tokenSaleContracts: {},
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
    setFungibleTokenContract(state, contractAddress, instance) {
      state.fungibleTokenContracts[contractAddress] = instance;
    },
    setTokenVotingContract(state, contractAddress, instance) {
      state.tokenVotingContracts[contractAddress] = instance;
    },
    setTokenSaleContract(state, contractAddress, instance) {
      state.tokenSaleContracts[contractAddress] = instance;
    },
    setWordRegistryContract(state, instance) {
      state.wordRegistryContract = instance;
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
            new MemoryAccount({
              keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') },
            }),
          ],
          address: Cypress.env('publicKey'),
        });
        // TODO fix to apply to new standard
        const rpcClient = async () => Cypress.env('publicKey');
        instance.rpcClient = { getCurrentAccount: async () => Cypress.env('publicKey') };
        commit('setSdk', { instance, rpcClient });
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
          if (!newWallet) return null;
          clearInterval(webWalletTimeout);
          await sdk.connectToWallet(await newWallet.getConnection());
          const ret = await sdk.subscribeAddress('subscribe', 'current');
          const { address: { current } } = ret;
          const address = Object.keys(current)[0];
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

      const scannerConnection = new BrowserWindowMessageConnection({
        connectionInfo: { id: 'spy' },
      });
      stopScan = walletDetector(scannerConnection, handleNewWallet);

      return new Promise((_resolve, _rejected) => {
        resolve = _resolve;
        rejected = _rejected;
      });
    },
    async getHeight({ state: { sdk } }) {
      return sdk.getHeight();
    },
    async initFungibleTokenContractIfNeeded(
      { commit, state: { sdk, fungibleTokenContracts } },
      contractAddress,
    ) {
      if (!fungibleTokenContracts[contractAddress]) {
        const contract = await sdk
          .initializeContract({
            aci: FUNGIBLE_TOKEN_ACI,
            address: contractAddress,
          });
        commit('setFungibleTokenContract', contractAddress, contract);
        return contract;
      }

      return fungibleTokenContracts[contractAddress];
    },
    async initWordRegistryContractIfNeeded({ commit, state: { sdk, wordRegistryContract } }) {
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // if (!wordRegistryContract) {
      //   const contract = await sdk.initializeContract({
      //     aci: WORD_REGISTRY_CONTRACT,
      //     address: process.env.VUE_APP_WORD_REGISTRY_ADDRESS,
      //   });
      //   commit('setWordRegistryContract', contract);
      //   return contract;
      // }
      //
      // return wordRegistryContract;
    },
    async initTokenVotingContractIfNeeded(
      { commit, state: { sdk, tokenVotingContracts } },
      contractAddress,
    ) {
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // if (!tokenVotingContracts[contractAddress]) {
      //   const contract = await sdk.initializeContract({
      //     aci: TOKEN_VOTING_CONTRACT,
      //     address: contractAddress,
      //   });
      //   commit('setTokenVotingContract', contractAddress, contract);
      //   return contract;
      // }
      //
      // return tokenVotingContracts[contractAddress];
    },
    async initTokenSaleContractIfNeeded(
      { commit, state: { sdk, tokenSaleContracts } },
      contractAddress,
    ) {
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // if (!tokenSaleContracts[contractAddress]) {
      //   const contract = await sdk.initializeContract({
      //     aci: TOKEN_SALE_CONTRACT,
      //     address: contractAddress,
      //   });
      //   commit('setTokenSaleContract', contractAddress, contract);
      //   return contract;
      // }
      // return tokenSaleContracts[contractAddress];
    },
    async deployBondingCurve({ state: { sdk } }, decimals) {
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet'); // alters bonding curve contract to change the dependency default 1 alpha to 18
      // as we use 18 decimals and thus need to adjust the curve to match that
      // const BONDING_CURVE_DECIMALS = BONDING_CURVE.replace(
      //   'function alpha() : Frac.frac = Frac.make_frac(1, 1)',
      //   `function alpha() : Frac.frac = Frac.make_frac(1, ${shiftDecimalPlaces(1, decimals)})`,
      // );
      // const contract = await sdk.getContractInstance(BONDING_CURVE_DECIMALS);
      // await contract.init();
      //
      // return contract.deployInfo.address;
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
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // alters token sale contract to change the dependency default 1 decimals to 18
      // as we want that as default for use with wordbazaar
      // const TOKEN_SALE_CONTRACT_DECIMALS = TOKEN_SALE_CONTRACT.replace(
      //   'let decimals = 1',
      //   `let decimals = ${shiftDecimalPlaces(1, decimals)}`,
      // );
      //
      // const contract = await sdk.getContractInstance(TOKEN_SALE_CONTRACT_DECIMALS);
      // await contract.init(timeout, bondingCurveAddress, description);
      // commit('setTokenSaleContract', contract.deployInfo.address, contract);
      // return contract.deployInfo.address;
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
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // const contract = await sdk.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      // await contract
      // .init(name, decimals, symbol, tokenSaleAddress, process.env.VUE_APP_WORD_REGISTRY_ADDRESS);
      // commit('setFungibleTokenContract', contract.deployInfo.address, contract);
      // return contract.deployInfo.address;
    },
    async deployTokenVotingContract(
      { commit, state: { sdk } },
      {
        metadata,
        closeHeight,
        token,
      },
    ) {
      // FIXME implement wordbazaar contracts
      throw new Error('Wordbazaar contracts are not implemented yet');
      // const contract = await sdk.getContractInstance(TOKEN_VOTING_CONTRACT);
      // await contract.init(metadata, closeHeight, token);
      // commit('setTokenVotingContract', contract.deployInfo.address, contract);
      // return contract.deployInfo.address;
    },
    async wordRegistryAddToken({ dispatch }, addTokenAddress) {
      const contract = await dispatch('initWordRegistryContractIfNeeded');

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
      const contract = await dispatch('initTokenSaleContractIfNeeded', contractAddress);

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
      const contract = await dispatch('initTokenVotingContractIfNeeded', contractAddress);

      const { decodedResult } = await contract[method](...args, options);
      return decodedResult;
    },
    async tokenBalance({ dispatch }, { contractAddress, address }) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

      const { decodedResult } = await contract.balance(address);
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async tokenTotalSupply({ dispatch }, contractAddress) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

      const { decodedResult } = await contract.total_supply();
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async createOrChangeAllowance(
      { dispatch, state: { sdk } },
      { contractAddress, amount, forAccount = null },
    ) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

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
