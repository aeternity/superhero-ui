/* globals Cypress */

import {
  Node, Universal, Aepp, MemoryAccount,
} from '@aeternity/aepp-sdk/es';
import TIPPING_INTERFACE from '../contracts/TippingInterface.aes';
import ORACLE_INTERFACE from '../contracts/OracleServiceInterface.aes';
import TippingContractUtil from './tippingContractUtil';

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

aeternity.initProvider = async (force = false) => {
  // TESTING
  let isForce = force;
  if (typeof Cypress !== 'undefined') {
    aeternity.contractAddress = 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i';
    aeternity.oracleContract = {
      methods: {
        get_state: async () => ({ success_claimed_urls: [] }),
      },
    };
    isForce = false;
    aeternity.client = await Universal({
      compilerUrl: 'https://latest.compiler.aepps.com',
      nodes: [{ name: 'testnet', instance: await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: 'https://sdk-testnet.aepps.com' }) }],
      accounts: [
        MemoryAccount({ keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') } }),
      ],
      address: Cypress.env('publicKey'),
    });
  }
  try {
    if (isForce || (aeternity.contractAddress && !aeternity.contract)) {
      aeternity.contract = await aeternity.client
        .getContractInstance(TIPPING_INTERFACE, { contractAddress: aeternity.contractAddress });
    }
    if (isForce || (aeternity.oracleContractAddress && !aeternity.oracleContract)) {
      aeternity.oracleContract = await aeternity.client
        .getContractInstance(
          ORACLE_INTERFACE,
          { contractAddress: aeternity.oracleContractAddress },
        );
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
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
    } catch (e) {
      console.error(e);
      result = false;
    }
  } else {
    result = await aeternity.initProvider();
  }
  return result;
};

aeternity.getTips = async () => {
  const result = await aeternity.contract.methods.get_state();
  const state = TippingContractUtil.getTipsRetips(result.decodedResult);
  return state;
};

aeternity.getTip = async (id) => {
  const tips = await aeternity.getTips();
  return tips.find((tip) => tip.id === id);
};

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address;
};

export default aeternity;
