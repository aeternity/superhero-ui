import Aepp from '@aeternity/aepp-sdk/es/ae/aepp'
import Util from './util'
import CONTRACT_TIP_ANY from '../contracts/WaelletTipAnyBasic.aes'
import {Universal} from "@aeternity/aepp-sdk/es/ae/universal";

const aeternity = {
  client: null,
  address: null,
  height: null,
  networkId: null,
  passive: false,
  contractAddress: 'ct_cT9mSpx9989Js39ag45fih2daephb7YsicsvNdUdEB156gT5C'
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

aeternity.initProvider = async () => {
  try {
    aeternity.height = await aeternity.client.height();
    aeternity.networkId = (await aeternity.client.getNodeInfo()).nodeNetworkId;
    if (aeternity.contractAddress)
      aeternity.contract = await aeternity.client.getContractInstance(CONTRACT_TIP_ANY, {contractAddress: aeternity.contractAddress});
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
    url: 'https://sdk-mainnet.aepps.com',
    internalUrl: 'https://sdk-mainnet.aepps.com',
    compilerUrl: 'https://compiler.aepps.com'
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
      url: 'https://sdk-testnet.aepps.com',
      internalUrl: 'https://sdk-testnet.aepps.com',
      compilerUrl: 'https://compiler.aepps.com',
      keypair: {
        publicKey: process.env.PUBLIC_KEY,
        secretKey: process.env.PRIVATE_KEY
      }
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

const parseTips = (tips) => {
  return tips.map(([tip, data]) => {
    data.url = tip[0];
    data.amount = Util.atomsToAe(data.amount);
    return data;
  });
};

aeternity.getTips = async () => {
  const contractState = (await aeternity.contract.methods.get_state()).decodedResult;
  return parseTips(contractState.tips);
};

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address
};

export default aeternity
