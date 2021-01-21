/* globals Cypress */
import {
  MemoryAccount, Node, Universal, RpcAepp,
} from '@aeternity/aepp-sdk/es';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import TIPPING_INTERFACE_V1 from 'tipping-contract/Tipping_v1_Interface.aes';
import TIPPING_INTERFACE_V2 from 'tipping-contract/Tipping_v2_Interface.aes';
import TIPPING_INTERFACE_V3 from 'tipping-contract/Tipping_v3_Interface.aes';
import tippingContractUtil from 'tipping-contract/util/tippingContractUtil';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import { BigNumber } from 'bignumber.js';
import { IS_MOBILE_DEVICE } from '../../utils';

// todo: getters
export default {
  namespaced: true,
  state: {
    sdk: null,
    useSdkWallet: false,
    useIframeWallet: false,
    contractV1: null,
    contractV2: null,
    contractV3: null,
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
    useSdkWallet(state) {
      state.useSdkWallet = true;
    },
    enableIframeWallet(state) {
      state.useIframeWallet = true;
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
    async tokenBalance({ state: { sdk } }, token, address) {
      const tokenContract = await sdk
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: token });

      const { decodedResult } = await tokenContract.methods.balance(address);
      return new BigNumber(decodedResult || 0).toFixed();
    },
    async createOrChangeAllowance({ state: { sdk } }, tokenAddress, amount) {
      const tokenContract = await sdk
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: tokenAddress });

      const { decodedResult } = await tokenContract.methods.allowance({
        from_account: await sdk.address(),
        for_account: process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
      });

      const allowanceAmount = decodedResult !== undefined
        ? new BigNumber(decodedResult).multipliedBy(-1).plus(amount).toNumber()
        : amount;

      return tokenContract
        .methods[decodedResult !== undefined ? 'change_allowance' : 'create_allowance'](
          process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
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
        await dispatch('createOrChangeAllowance', tokenAddress, amount);
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
        await dispatch('createOrChangeAllowance', tokenAddress, amount);
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
