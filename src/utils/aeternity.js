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
import { EventBus } from './eventBus';
import store from '../store';

const nodeUrl = 'https://testnet.aeternity.io';
const nodeUrlTestNet = 'https://testnet.aeternity.io';
const compilerUrl = 'https://latest.compiler.aepps.com';
const contractV1Address = window.Cypress
  ? 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i'
  : 'ct_2Cvbf3NYZ5DLoaNYAU71t67DdXLHeSXhodkSNifhgd7Xsw28Xd';
const contractV2Address = window.Cypress
  ? 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i'
  : 'ct_2ZEoCKcqXkbz2uahRrsWeaPooZs9SdCv6pmC4kc55rD4MhqYSu';
let contractV1;
let contractV2;

export let client; // eslint-disable-line import/no-mutable-exports

const initTippingContractIfNeeded = async () => {
  if (!client) throw new Error('Init sdk first');
  if (!contractV1) {
    contractV1 = await client
      .getContractInstance(TIPPING_V1_INTERFACE, { contractAddress: contractV1Address });
  }
  if (!contractV2) {
    contractV2 = await client
      .getContractInstance(TIPPING_V2_INTERFACE, { contractAddress: contractV2Address });
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
    } else {
      client = await RpcAepp({
        name: 'Superhero',
        nodes: [{ name: 'mainnet', instance: await Node({ url: nodeUrl, internalUrl: nodeUrl }) }],
        compilerUrl,
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
  const webWalletTimeout = setTimeout(() => store.commit('useIframeWallet'), 2000);

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

  return tokenContract.methods.balance(address)
    .then((r) => new BigNumber(r.decodedResult ? r.decodedResult : 0).toFixed());
};

const createOrChangeAllowance = async (tokenAddress, amount) => {
  const tokenContract = await client
    .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: tokenAddress });

  await tokenContract.methods.allowance({
    from_account: await client.address(),
    for_account: contractV2Address.replace('ct_', 'ak_'),
  }).then((r) => {
    if (r.decodedResult !== undefined) {
      const allowanceAmount = new BigNumber(r.decodedResult)
        .multipliedBy(-1).plus(amount).toNumber();

      return tokenContract.methods.change_allowance(contractV2Address.replace('ct_', 'ak_'), allowanceAmount);
    }

    return tokenContract.methods.create_allowance(contractV2Address.replace('ct_', 'ak_'), amount);
  });
};

// will always tip to the latest contract
export const tip = async (url, title, amount) => {
  await initTippingContractIfNeeded();
  return contractV2.methods.tip(url, title, { amount });
};

export const tipToken = async (url, title, amount, tokenAddress) => {
  await initTippingContractIfNeeded();
  await createOrChangeAllowance(tokenAddress, amount);

  return contractV2.methods.tip_token(url, title, tokenAddress, amount);
};

export const retip = async (contractAddress, id, amount) => {
  await initTippingContractIfNeeded();
  if (contractAddress === contractV1Address) {
    return contractV1.methods.retip(Number(id.split('_')[0]), { amount });
  }

  if (contractAddress === contractV2Address) {
    return contractV2.methods.retip(Number(id.split('_')[0]), { amount });
  }

  return null;
};

export const retipToken = async (id, amount, tokenAddress) => {
  await initTippingContractIfNeeded();
  await createOrChangeAllowance(tokenAddress, amount);

  return contractV2.methods.retip_token(Number(id.split('_')[0]), tokenAddress, amount);
};
