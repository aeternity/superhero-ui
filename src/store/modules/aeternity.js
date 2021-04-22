/* globals Cypress */
import {
  MemoryAccount, Node, Universal, RpcAepp, Crypto,
} from '@aeternity/aepp-sdk/es';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import TIPPING_INTERFACE_V1 from 'tipping-contract/Tipping_v1_Interface.aes';
import TIPPING_INTERFACE_V2 from 'tipping-contract/Tipping_v2_Interface.aes';
import TIPPING_INTERFACE_V3 from 'tipping-contract/Tipping_v3_Interface.aes';
import tippingContractUtil from 'tipping-contract/util/tippingContractUtil';

import FUNGIBLE_TOKEN_CONTRACT_INTERFACE from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_VOTING_CONTRACT from 'wordbazaar-contracts/TokenVoting.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import BONDING_CURVE from 'sophia-bonding-curve/BondCurveLinear.aes';

import { BigNumber } from 'bignumber.js';
import { IS_MOBILE_DEVICE, shiftDecimalPlaces, createDeepLinkUrl } from '../../utils';

export default {
  namespaced: true,
  state: {
    sdk: null,
    universal: null,
    useSdkWallet: false,
    useIframeWallet: false,
    contractV1: null,
    contractV2: null,
    contractV3: null,
    wordRegistryContract: null,
    fungibleTokenContracts: {},
    tokenVotingContracts: {},
    tokenSaleContracts: {},
    isTippingContractsInitialised: false,
  },
  mutations: {
    setContracts(state, contracts) {
      const [contractV1, contractV2, contractV3] = contracts;
      state.contractV1 = contractV1;
      state.contractV2 = contractV2;
      state.contractV3 = contractV3;
      state.isTippingContractsInitialised = true;
    },
    setSdk(state, { instance }) {
      state.sdk = instance;
    },
    setUniversal(state, instance) {
      state.universal = instance;
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
    async initTippingContractIfNeeded({
      commit,
      state: {
        sdk,
        isTippingContractsInitialised,
      },
    }) {
      if (!sdk) throw new Error('Init sdk first');
      if (isTippingContractsInitialised) return;
      const contracts = await Promise.all([
        [TIPPING_INTERFACE_V1, process.env.VUE_APP_CONTRACT_V1_ADDRESS],
        [TIPPING_INTERFACE_V2, process.env.VUE_APP_CONTRACT_V2_ADDRESS],
        [TIPPING_INTERFACE_V3, process.env.VUE_APP_CONTRACT_V3_ADDRESS],
      ].map(([tippingInterface, contractAddress]) => (contractAddress
        ? sdk.getContractInstance(tippingInterface, { contractAddress })
        : null)));
      commit('setContracts', contracts);
    },
    async initSdk({ dispatch, commit }) {
      try {
        const options = {
          nodes: [{ name: 'node', instance: await Node({ url: process.env.VUE_APP_NODE_URL }) }],
          compilerUrl: process.env.VUE_APP_COMPILER_URL,
        };
        if (window.Cypress) {
          const instance = await Universal({
            ...options,
            accounts: [
              MemoryAccount({
                keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') },
              }),
            ],
            address: Cypress.env('publicKey'),
          });
          const rpcClient = async () => Cypress.env('publicKey');
          instance.rpcClient = { getCurrentAccount: async () => Cypress.env('publicKey') };
          commit('setSdk', { instance, rpcClient });
          await dispatch('initTippingContractIfNeeded');
        } else {
          const instance = await RpcAepp({
            ...options,
            name: 'Superhero',
            onDisconnect() {
              commit('resetState');
            },
          });
          commit('setSdk', { instance });
          await dispatch('initTippingContractIfNeeded');
        }
      } catch (err) {
        commit('setBackendStatus', false, { root: true });
        return;
      }
      commit('setBackendStatus', true, { root: true });
    },
    async initUniversal({ commit }) {
      const instance = await Universal({
        nodes: [
          { name: 'ae_uat', instance: await Node({ url: process.env.VUE_APP_NODE_URL }) },
        ],
        compilerUrl: process.env.VUE_APP_COMPILER_URL,
      });
      commit('setUniversal', instance);
    },
    async scanForWallets({ commit, state: { sdk } }) {
      const scannerConnection = await BrowserWindowMessageConnection({
        connectionInfo: { id: 'spy' },
      });
      const detector = await Detector({ connection: scannerConnection });
      const webWalletTimeout = setTimeout(() => !IS_MOBILE_DEVICE && commit('enableIframeWallet'), 10000);

      return new Promise((resolve) => {
        detector.scan(async ({ newWallet }) => {
          if (!newWallet) return;
          clearInterval(webWalletTimeout);
          await sdk.connectToWallet(await newWallet.getConnection());
          await sdk.subscribeAddress('subscribe', 'current');
          const address = sdk.rpcClient.getCurrentAccount();
          if (!address) return;
          detector.stopScan();
          commit('setAddress', address, { root: true });
          resolve(address);
        });
      });
    },
    async getHeight({ state: { sdk } }) {
      return sdk.height();
    },
    async initFungibleTokenContractIfNeeded(
      { commit, state: { sdk, fungibleTokenContracts } },
      contractAddress,
    ) {
      if (!fungibleTokenContracts[contractAddress]) {
        const contract = await sdk
          .getContractInstance(FUNGIBLE_TOKEN_CONTRACT_INTERFACE, { contractAddress });
        commit('setFungibleTokenContract', contractAddress, contract);
        return contract;
      }

      return fungibleTokenContracts[contractAddress];
    },
    async initWordRegistryContractIfNeeded({ commit, state: { sdk, wordRegistryContract } }) {
      if (!wordRegistryContract) {
        const contract = await sdk
          .getContractInstance(WORD_REGISTRY_CONTRACT,
            { contractAddress: process.env.VUE_APP_WORD_REGISTRY_ADDRESS });
        commit('setWordRegistryContract', contract);
        return contract;
      }

      return wordRegistryContract;
    },
    async initTokenVotingContractIfNeeded(
      { commit, state: { sdk, tokenVotingContracts } },
      contractAddress,
    ) {
      if (!tokenVotingContracts[contractAddress]) {
        const contract = await sdk
          .getContractInstance(TOKEN_VOTING_CONTRACT, { contractAddress });
        commit('setTokenVotingContract', contractAddress, contract);
        return contract;
      }

      return tokenVotingContracts[contractAddress];
    },
    async initTokenSaleContractIfNeeded(
      { commit, state: { sdk, tokenSaleContracts } },
      contractAddress,
    ) {
      if (!tokenSaleContracts[contractAddress]) {
        const contract = await sdk.getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress });
        commit('setTokenSaleContract', contractAddress, contract);
        return contract;
      }

      return tokenSaleContracts[contractAddress];
    },
    async deployBondingCurve({ state: { sdk } }, decimals) {
      // alters bonding curve contract to change the dependency default 1 alpha to 18
      // as we use 18 decimals and thus need to adjust the curve to match that
      const BONDING_CURVE_DECIMALS = BONDING_CURVE.replace(
        'function alpha() : Frac.frac = Frac.make_frac(1, 1)',
        `function alpha() : Frac.frac = Frac.make_frac(1, ${shiftDecimalPlaces(1, decimals)})`,
      );
      const contract = await sdk.getContractInstance(BONDING_CURVE_DECIMALS);
      await contract.methods.init();

      return contract.deployInfo.address;
    },
    async deployTokenSaleContract(
      { commit, state: { sdk, universal, useSdkWallet }, rootState: { address } },
      {
        decimals,
        timeout,
        bondingCurveAddress,
        description,
        name,
        symbol,
      },
    ) {
      // alters token sale contract to change the dependency default 1 decimals to 18
      // as we want that as default for use with wordbazaar
      const TOKEN_SALE_CONTRACT_DECIMALS = TOKEN_SALE_CONTRACT.replace(
        'let decimals = 1',
        `let decimals = ${shiftDecimalPlaces(1, decimals)}`,
      );

      if (useSdkWallet) {
        const contract = await sdk.getContractInstance(TOKEN_SALE_CONTRACT_DECIMALS);
        await contract.methods.init(timeout, bondingCurveAddress, description);
        commit('setTokenSaleContract', contract.deployInfo.address, contract);
        return contract.deployInfo.address;
      }

      const contract = await universal.getContractInstance(TOKEN_SALE_CONTRACT_DECIMALS);
      const onAccount = {
        address: () => address,
        sign: () => { throw new Error('Private key is not available'); },
      };
      const { tx } = await contract.methods.init
        .get(timeout, bondingCurveAddress, description, { onAccount });
      window.location = createDeepLinkUrl({
        type: 'sign-transaction',
        transaction: tx.encodedTx,
        networkId: 'ae_uat',
        broadcast: true,
        'x-success': `${window.location.href.split('?')[0]}?transaction-hash={transaction-hash}&step=2&symbol=${symbol}&name=${name}`,
        'x-cancel': window.location.href.split('?')[0],
      });
      return null;
    },
    async deployFungibleTokenContract(
      { commit, state: { sdk, universal, useSdkWallet }, rootState: { address } },
      {
        name,
        decimals,
        symbol,
        tokenSaleAddress,
      },
    ) {
      if (useSdkWallet) {
        const contract = await sdk.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
        await contract.methods.init(name,
          decimals, symbol, tokenSaleAddress, process.env.VUE_APP_WORD_REGISTRY_ADDRESS);
        commit('setFungibleTokenContract', contract.deployInfo.address, contract);
        return contract.deployInfo.address;
      }

      const contract = await universal.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      const onAccount = {
        address: () => address,
        sign: () => { throw new Error('Private key is not available'); },
      };
      const { tx } = await contract.methods.init.get(name,
        decimals, symbol, tokenSaleAddress,
        process.env.VUE_APP_WORD_REGISTRY_ADDRESS, { onAccount });
      window.location = createDeepLinkUrl({
        type: 'sign-transaction',
        transaction: tx.encodedTx,
        networkId: 'ae_uat',
        broadcast: true,
        'x-success': `${window.location.href.split('?')[0]}?transaction-hash={transaction-hash}&step=3&symbol=${symbol}`,
        'x-cancel': window.location.href.split('?')[0],
      });
      return null;
    },
    async deployTokenVotingContract(
      { commit, state: { sdk } },
      {
        metadata,
        closeHeight,
        token,
      },
    ) {
      const contract = await sdk.getContractInstance(TOKEN_VOTING_CONTRACT);
      await contract.methods.init(metadata, closeHeight, token);
      commit('setTokenVotingContract', contract.deployInfo.address, contract);
      return contract.deployInfo.address;
    },
    async wordRegistryAddToken({ dispatch }, addTokenAddress) {
      const contract = await dispatch('initWordRegistryContractIfNeeded');

      const { decodedResult } = await contract.methods.add_token(addTokenAddress);
      return decodedResult;
    },
    async decodeHash({ state: { universal } }, { contract, txHash, method }) {
      const result = await universal.getTxInfo(txHash);
      const data = universal
        .contractDecodeData(contract, method, result.returnValue, result.returnType);
      return data;
    },
    async tokenSaleMethod(
      { dispatch, state: { useSdkWallet, universal }, rootState: { address } },
      {
        contractAddress,
        method,
        args = [],
        options = {},
        dryRun = false,
      },
    ) {
      if (useSdkWallet || dryRun) {
        const contract = await dispatch('initTokenSaleContractIfNeeded', contractAddress);
        const { decodedResult } = await contract.methods[method](...args, options);
        return decodedResult;
      }

      const contract = await universal
        .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress });
      const onAccount = {
        address: () => address,
        sign: () => { throw new Error('Private key is not available'); },
      };
      const { tx } = await contract.methods[method].get(...args, { onAccount, ...options });
      window.location = createDeepLinkUrl({
        type: 'sign-transaction',
        transaction: tx.encodedTx,
        networkId: 'ae_uat',
        broadcast: true,
        'x-success': window.location.href.split('?')[0],
        'x-cancel': window.location.href.split('?')[0],
      });
      return null;
    },
    async tokenVotingMethod(
      { dispatch, state: { useSdkWallet, universal }, rootState: { address } },
      {
        contractAddress,
        method,
        args = [],
        options = {},
        dryRun = false,
      },
    ) {
      if (useSdkWallet || dryRun) {
        const contract = await dispatch('initTokenVotingContractIfNeeded', contractAddress);
        const { decodedResult } = await contract.methods[method](...args, options);
        return decodedResult;
      }

      const contract = await universal
        .getContractInstance(TOKEN_VOTING_CONTRACT, { contractAddress });
      const onAccount = {
        address: () => address,
        sign: () => { throw new Error('Private key is not available'); },
      };
      const { tx } = await contract.methods[method].get(...args, { onAccount, ...options });
      window.location = createDeepLinkUrl({
        type: 'sign-transaction',
        transaction: tx.encodedTx,
        networkId: 'ae_uat',
        broadcast: true,
        'x-success': window.location.href.split('?')[0],
        'x-cancel': window.location.href.split('?')[0],
      });
      return null;
    },
    async tokenBalance({ dispatch }, { contractAddress, address }) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

      const { decodedResult } = await contract.methods.balance(address);
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async tokenTotalSupply({ dispatch }, contractAddress) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

      const { decodedResult } = await contract.methods.total_supply();
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async createOrChangeAllowance(
      { dispatch, state: { sdk } },
      { contractAddress, amount, forAccount = null },
    ) {
      const contract = await dispatch('initFungibleTokenContractIfNeeded', contractAddress);

      const { decodedResult } = await contract.methods.allowance({
        from_account: await sdk.address(),
        for_account: forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
      });

      const allowanceAmount = decodedResult !== undefined
        ? new BigNumber(decodedResult).multipliedBy(-1).plus(amount).toNumber()
        : amount;

      return contract.methods[decodedResult !== undefined ? 'change_allowance' : 'create_allowance'](
        forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
        allowanceAmount,
      );
    },
    async tip({ dispatch, state: { contractV2, contractV1 } }, {
      url,
      title,
      amount,
      tokenAddress = null,
    }) {
      await dispatch('initTippingContractIfNeeded');

      if (tokenAddress && tokenAddress !== 'native') {
        await dispatch('createOrChangeAllowance', { contractAddress: tokenAddress, amount });
        return contractV2.methods.tip_token(url, title, tokenAddress, amount);
      }

      return contractV2
        ? contractV2.methods.tip(url, title, { amount })
        : contractV1.methods.tip(url, title, { amount });
    },
    async retip({
      dispatch,
      state: {
        contractV1,
        contractV2,
      },
    }, {
      contractAddress,
      id,
      amount,
      tokenAddress = null,
    }) {
      await dispatch('initTippingContractIfNeeded');

      if (tokenAddress && tokenAddress !== 'native') {
        await dispatch('createOrChangeAllowance', { contractAddress: tokenAddress, amount });
        return contractV2.methods.retip_token(Number(id.split('_')[0]), tokenAddress, amount);
      }

      if (contractAddress === process.env.VUE_APP_CONTRACT_V1_ADDRESS) {
        return contractV1.methods.retip(Number(id.split('_')[0]), { amount });
      }

      if (contractAddress === process.env.VUE_APP_CONTRACT_V2_ADDRESS) {
        return contractV2.methods.retip(Number(id.split('_')[0]), { amount });
      }

      return null;
    },
    async postWithoutTip({ dispatch, state: { contractV3 } }, { title, media }) {
      await dispatch('initTippingContractIfNeeded');
      return contractV3.methods.post_without_tip(title, media);
    },
    async postWithoutTipSignature({ state: { sdk } }, { title, media }) {
      const message = tippingContractUtil.postWithoutTippingString(title, media);
      const hash = Crypto.hash(message);
      return sdk.signMessage(hash, { returnHex: true });
    },
  },
};
