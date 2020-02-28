import Util from './util'
import TIPPING_INTERFACE from '../contracts/TippingInterface.aes'
import { Node, Universal, Aepp, MemoryAccount } from '@aeternity/aepp-sdk/es';
import TippingContractUtil from './tippingContractUtil';

const aeternity = {
  client: null,
  contract: null,
  contractAddress: 'ct_3HiJVrUJPQR65ycBXiwPjYwKAwmkmwnSbv614pZKfQDKdhun4'
};

const timeout = async (promise) => {
  return Promise.race([
    promise,
    new Promise(resolve =>
      setTimeout(() => {
        resolve('TIMEOUT');
      }, 30000))
  ]);
};

aeternity.initProvider = async (force = false) => {
  try {
    if (force || aeternity.contractAddress && !aeternity.contract)
      aeternity.contract = await aeternity.client.getContractInstance(TIPPING_INTERFACE, {contractAddress: aeternity.contractAddress});
    return true;
  } catch (e) {
    console.error(e);
    return false
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

aeternity.initStaticClient = async () => {
  return Universal({
    compilerUrl: 'https://latest.compiler.aepps.com',
    nodes: [
      {
        name: 'mainnet',
        instance: await Node({
          url: 'https://sdk-mainnet.aepps.com',
          internalUrl: 'https://sdk-mainnet.aepps.com',
        })
      }]
  });
};

aeternity.hasActiveWallet = () => {
  return !!aeternity.client;
};

aeternity.isTestnet = () => {
  return aeternity.networkId !== 'ae_mainnet';
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<boolean>}
 */
aeternity.initClient = async () => {
  let result = true;

  if (process && process.env && process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
    aeternity.client = await Universal({
      compilerUrl: 'https://latest.compiler.aepps.com',
      nodes: [{ name: 'testnet', instance: await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: 'https://sdk-testnet.aepps.com' }) }],
      accounts: [
        MemoryAccount({ keypair: { secretKey: process.env.PRIVATE_KEY, publicKey: process.env.PUBLIC_KEY } }),
      ],
      address: process.env.PUBLIC_KEY,
    });
    return await aeternity.initProvider();
  }

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
  return state.tips;
};

aeternity.getTip = async (id) => {
  const tips = await aeternity.getTips();
  return tips.find(tip => tip.id === id);
};

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address
};

export default aeternity
