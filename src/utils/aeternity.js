/* globals Cypress */

import {
  MemoryAccount, Node, Universal, RpcAepp,
} from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import TIPPING_V1_INTERFACE from 'tipping-contract/Tipping_v1_Interface.aes';
import TIPPING_V2_INTERFACE from 'tipping-contract/Tipping_v2_Interface.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import { BigNumber } from 'bignumber.js';
import { COMPILER_URL, NODE_URL } from '../config/constants';
import store from '../store';
import { IS_MOBILE_DEVICE } from './index';

let contractV1;
let contractV2;

export let client; // eslint-disable-line import/no-mutable-exports

const initTippingContractIfNeeded = async () => {
  if (!client) throw new Error('Init sdk first');
  if (!contractV1) {
    contractV1 = await client.getContractInstance(TIPPING_V1_INTERFACE, {
      contractAddress: process.env.VUE_APP_CONTRACT_V1_ADDRESS,
    });
  }
  if (!contractV2 && process.env.VUE_APP_CONTRACT_V2_ADDRESS) {
    contractV2 = await client.getContractInstance(TIPPING_V2_INTERFACE, {
      contractAddress: process.env.VUE_APP_CONTRACT_V2_ADDRESS,
    });
  }
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<>}
 */
export const initClient = async () => {
  try {
    if (window.Cypress) {
      client = await Universal({
        compilerUrl: COMPILER_URL,
        nodes: [{
          name: 'testnet',
          instance: await Node({ url: 'https://testnet.aeternity.io' }),
        }],
        accounts: [
          MemoryAccount({
            keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') },
          }),
        ],
        address: Cypress.env('publicKey'),
      });
      client.rpcClient = {
        getCurrentAccount: async () => Cypress.env('publicKey'),
      };
      await initTippingContractIfNeeded();
    } else {
      client = await RpcAepp({
        name: 'Superhero',
        nodes: [{ name: 'node', instance: await Node({ url: NODE_URL }) }],
        compilerUrl: COMPILER_URL,
        onDisconnect() {
          store.commit('resetState');
        },
      });
    }
    store.commit('setSdk', client);
  } catch (err) {
    store.commit('setBackendStatus', false);
    return;
  }
  store.commit('setBackendStatus', true);
};

export const scanForWallets = async () => {
  const scannerConnection = await BrowserWindowMessageConnection({
    connectionInfo: { id: 'spy' },
  });
  const detector = await Detector({ connection: scannerConnection });
  const webWalletTimeout = setTimeout(() => !IS_MOBILE_DEVICE && store.commit('enableIframeWallet'), 10000);

  return new Promise((resolve) => {
    detector.scan(async ({ newWallet }) => {
      if (!newWallet) return;
      clearInterval(webWalletTimeout);
      detector.stopScan();
      await client.connectToWallet(await newWallet.getConnection());
      await client.subscribeAddress('subscribe', 'current');
      resolve();
    });
  });
};

export const tokenBalance = async (token, address) => {
  const tokenContract = await client
    .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: token });

  const { decodedResult } = await tokenContract.methods.balance(address);
  return new BigNumber(decodedResult || 0).toFixed();
};

const createOrChangeAllowance = async (tokenAddress, amount) => {
  const tokenContract = await client
    .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: tokenAddress });

  const { decodedResult } = await tokenContract.methods.allowance({
    from_account: await client.address(),
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
};

// will always tip to the latest contract
export const tip = async (url, title, amount, tokenAddress = null) => {
  await initTippingContractIfNeeded();

  if (tokenAddress && tokenAddress !== 'native') {
    await createOrChangeAllowance(tokenAddress, amount);
    return contractV2.methods.tip_token(url, title, tokenAddress, amount);
  }

  return contractV2
    ? contractV2.methods.tip(url, title, { amount })
    : contractV1.methods.tip(url, title, { amount });
};

export const retip = async (contractAddress, id, amount, tokenAddress = null) => {
  await initTippingContractIfNeeded();

  if (tokenAddress && tokenAddress !== 'native') {
    await createOrChangeAllowance(tokenAddress, amount);
    return contractV2.methods.retip_token(Number(id.split('_')[0]), tokenAddress, amount);
  }

  if (contractAddress === process.env.VUE_APP_CONTRACT_V1_ADDRESS) {
    return contractV1.methods.retip(Number(id.split('_')[0]), { amount });
  }

  if (contractAddress === process.env.VUE_APP_CONTRACT_V2_ADDRESS) {
    return contractV2.methods.retip(Number(id.split('_')[0]), { amount });
  }

  return null;
};
