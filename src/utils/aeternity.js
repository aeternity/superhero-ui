/* globals Cypress */

import {
  Aepp, MemoryAccount, Node, Universal,
} from '@aeternity/aepp-sdk/es';
import TIPPING_INTERFACE from '../contracts/TippingInterface.aes';
import ORACLE_INTERFACE from '../contracts/OracleServiceInterface.aes';
import TippingContractUtil from './tippingContractUtil';
import { EventBus } from './eventBus';

const aeternity = {
  client: null,
  contract: null,
  contractAddress: 'ct_2AfnEfCSZCTEkxL5Yoi4Yfq6fF7YapHRaFKDJK3THMXMBspp5z',
  oracleContract: null,
  oracleContractAddress: 'ct_2VpQ1QGXy7KA2rsQmC4QraFKwQam3Ksqq3cAK8KHUNwhoiQkL',
};

const timeout = async (promise) => Promise.race([
  promise,
  new Promise((resolve) => setTimeout(() => {
    resolve('TIMEOUT');
  }, 30000)),
]);

aeternity.initProvider = async () => {
  // TESTING
  if (typeof Cypress !== 'undefined') {
    aeternity.contractAddress = 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i';
    aeternity.oracleContractAddress = 'ct_gAmsWu28jMniDJrdDnZ3FobCTZNVg1DQRSyeQF95Hux6rtdG';
    aeternity.client = await Universal({
      compilerUrl: 'https://latest.compiler.aepps.com',
      nodes: [{ name: 'testnet', instance: await Node({ url: 'https://testnet.aeternity.io', internalUrl: 'https://testnet.aeternity.io' }) }],
      accounts: [
        MemoryAccount({ keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') } }),
      ],
      address: Cypress.env('publicKey'),
    });
    aeternity.initTippingContractIfNeeded().then(() => {
      aeternity.contract.methods.migrate_balance(Cypress.env('publicKey'));
    });
  }
};

aeternity.initTippingContractIfNeeded = async () => {
  if (!aeternity.client) throw new Error('Init sdk first');
  if (!aeternity.contract) {
    aeternity.contract = await aeternity.client
      .getContractInstance(TIPPING_INTERFACE, { contractAddress: aeternity.contractAddress });
  }
};

aeternity.initOracleContractIfNeeded = async () => {
  if (!aeternity.client) throw new Error('Init sdk first');
  if (!aeternity.oracleContract) {
    aeternity.oracleContract = await aeternity.client
      .getContractInstance(ORACLE_INTERFACE, { contractAddress: aeternity.oracleContractAddress });
  }
};

aeternity.initMobileBaseAepp = async () => {
  try {
    if (window.parent === window) return false;
    return await timeout(Aepp());
  } catch (e) {
    console.warn('Base Aepp init failed');
    return false;
  }
};

aeternity.initStaticClient = async () => Universal({
  compilerUrl: 'https://latest.compiler.aepps.com',
  nodes: [
    {
      name: 'mainnet',
      instance: await Node({
        url: 'https://sdk-mainnet.aepps.com',
        internalUrl: 'https://sdk-mainnet.aepps.com',
      }),
    }],
});

aeternity.hasActiveWallet = () => !!aeternity.client;

aeternity.isTestnet = () => aeternity.networkId !== 'ae_mainnet';

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<boolean>}
 */
aeternity.initClient = async () => {
  let result = true;

  if (!aeternity.client) {
    try {
      aeternity.client = await aeternity.initStaticClient();
      result = await aeternity.initProvider();
    } catch (err) {
      EventBus.$emit('backendError');
      result = false;
    }
  } else {
    result = await aeternity.initProvider();
  }
  return result;
};

aeternity.getOracleState = async () => {
  await aeternity.initOracleContractIfNeeded();

  const state = await aeternity.oracleContract.methods.get_state();
  return state.decodedResult;
};

aeternity.getTips = async () => {
  await aeternity.initTippingContractIfNeeded();

  const result = await aeternity.contract.methods.get_state();
  return TippingContractUtil.getTipsRetips(result.decodedResult);
};

aeternity.retip = async (id, amount) => {
  await aeternity.initTippingContractIfNeeded();

  return aeternity.contract.methods.retip(id, { amount });
};

aeternity.tip = async (url, title, amount) => {
  await aeternity.initTippingContractIfNeeded();

  return aeternity.contract.methods.tip(url, title, { amount });
};

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address;
};

export default aeternity;
