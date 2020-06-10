/* globals Cypress */

import {
  MemoryAccount, Node, Universal, RpcAepp,
} from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import TIPPING_INTERFACE from '../contracts/TippingInterface.aes';
import { EventBus } from './eventBus';

// import store from '../store';

const nodeUrl = 'https://mainnet.aeternity.io';
const nodeUrlTestNet = 'https://testnet.aeternity.io';
const compilerUrl = 'https://latest.compiler.aepps.com';
const contractAddress = window.Cypress
  ? 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i'
  : 'ct_2AfnEfCSZCTEkxL5Yoi4Yfq6fF7YapHRaFKDJK3THMXMBspp5z';
let contract;

export let client; // eslint-disable-line import/no-mutable-exports

const initTippingContractIfNeeded = async () => {
  if (!client) throw new Error('Init sdk first');
  if (contract) return;
  contract = await client.getContractInstance(TIPPING_INTERFACE, { contractAddress });
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<>}
 */
export const initClient = async () => {
  try {
    if (window.Cypress) {
      client = await Universal({
        compilerUrl,
        nodes: [{
          name: 'testnet',
          instance: await Node({ url: nodeUrlTestNet, internalUrl: nodeUrlTestNet }),
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
        nodes: [{ name: 'mainnet', instance: await Node({ url: nodeUrl, internalUrl: nodeUrl }) }],
        compilerUrl,
      });
    }
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

  return new Promise((resolve) => {
    detector.scan(async ({ newWallet }) => {
      if (!newWallet) return;
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
