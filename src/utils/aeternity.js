/* globals Cypress */

import {
  MemoryAccount, Node, Universal, RpcAepp,
} from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import { CONTRACT_ADDRESS, COMPILER_URL, NODE_URL } from '@/config/constants';
import TIPPING_INTERFACE from '../contracts/TippingInterface.aes';
import { EventBus } from './eventBus';
import store from '../store';
import { IS_MOBILE_DEVICE } from './util';

let contract;

export let client; // eslint-disable-line import/no-mutable-exports

const initTippingContractIfNeeded = async () => {
  if (!client) throw new Error('Init sdk first');
  if (contract) return;
  contract = await client
    .getContractInstance(TIPPING_INTERFACE, { contractAddress: CONTRACT_ADDRESS });
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
      contract.methods.migrate_balance(Cypress.env('publicKey'));
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
    EventBus.$emit('backendError');
    return;
  }
  EventBus.$emit('backendLive');
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

export const tip = async (url, title, amount) => {
  await initTippingContractIfNeeded();
  return contract.methods.tip(url, title, { amount });
};

export const retip = async (id, amount) => {
  await initTippingContractIfNeeded();
  return contract.methods.retip(id, { amount });
};
