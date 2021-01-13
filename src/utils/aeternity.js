/* globals Cypress */
import {
  MemoryAccount, Node, Universal, RpcAepp, Crypto,
} from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import TIPPING_V1_INTERFACE from 'tipping-contract/Tipping_v1_Interface.aes';
import TIPPING_V2_INTERFACE from 'tipping-contract/Tipping_v2_Interface.aes';
import TIPPING_V3_INTERFACE from 'tipping-contract/Tipping_v3_Interface.aes';
import tippingContractUtil from 'tipping-contract/util/tippingContractUtil';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import { BigNumber } from 'bignumber.js';
import store from '../store';
import { IS_MOBILE_DEVICE } from './index';

let sdk;
let contractV1;
let contractV2;
let contractV3;
let isTippingContractsInitialised;

const initTippingContractIfNeeded = async () => {
  if (!sdk) throw new Error('Init sdk first');
  if (isTippingContractsInitialised) return;
  [contractV1, contractV2, contractV3] = await Promise.all([
    [TIPPING_V1_INTERFACE, process.env.VUE_APP_CONTRACT_V1_ADDRESS],
    [TIPPING_V2_INTERFACE, process.env.VUE_APP_CONTRACT_V2_ADDRESS],
    [TIPPING_V3_INTERFACE, process.env.VUE_APP_CONTRACT_V3_ADDRESS],
  ].map(([tippingInterface, contractAddress]) => (contractAddress
    ? sdk.getContractInstance(tippingInterface, { contractAddress })
    : null)));
  isTippingContractsInitialised = true;
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<>}
 */
export const initSdk = async () => {
  try {
    const common = {
      nodes: [{ name: 'node', instance: await Node({ url: process.env.VUE_APP_NODE_URL }) }],
      compilerUrl: process.env.VUE_APP_COMPILER_URL,
    };
    if (window.Cypress) {
      sdk = await Universal({
        ...common,
        accounts: [
          MemoryAccount({
            keypair: { secretKey: Cypress.env('privateKey'), publicKey: Cypress.env('publicKey') },
          }),
        ],
        address: Cypress.env('publicKey'),
      });
      sdk.rpcClient = {
        getCurrentAccount: async () => Cypress.env('publicKey'),
      };
      await initTippingContractIfNeeded();
    } else {
      sdk = await RpcAepp({
        ...common,
        name: 'Superhero',
        onDisconnect() {
          store.commit('resetState');
        },
      });
    }
    store.commit('setSdk', sdk);
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
      await sdk.connectToWallet(await newWallet.getConnection());
      await sdk.subscribeAddress('subscribe', 'current');
      const address = sdk.rpcClient.getCurrentAccount();
      if (!address) return;
      detector.stopScan();
      resolve(address);
    });
  });
};

export const createOrChangeAllowance = async (tokenAddress, amount, forAccount = null) => {
  const tokenContract = await sdk
    .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: tokenAddress });

  const { decodedResult } = await tokenContract.methods.allowance({
    from_account: await sdk.address(),
    for_account: forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
  });

  const allowanceAmount = decodedResult !== undefined
    ? new BigNumber(decodedResult).multipliedBy(-1).plus(amount).toNumber()
    : amount;

  return tokenContract
    .methods[decodedResult !== undefined ? 'change_allowance' : 'create_allowance'](
      forAccount || process.env.VUE_APP_CONTRACT_V2_ADDRESS.replace('ct_', 'ak_'),
      allowanceAmount,
    );
};

// will always tip to the latest contract
export const tip = async (url, title, amount, tokenAddress = null) => {
  await initTippingContractIfNeeded();

  if (tokenAddress !== null) {
    await createOrChangeAllowance(tokenAddress, amount);
    return contractV2.methods.tip_token(url, title, tokenAddress, amount);
  }

  return contractV2
    ? contractV2.methods.tip(url, title, { amount })
    : contractV1.methods.tip(url, title, { amount });
};

export const retip = async (contractAddress, id, amount, tokenAddress = null) => {
  await initTippingContractIfNeeded();

  if (tokenAddress !== null) {
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

export const postWithoutTip = async (title, media) => {
  await initTippingContractIfNeeded();
  return contractV3.methods.post_without_tip(title, media);
};

export const postWithoutTipSignature = async (title, media) => {
  const message = tippingContractUtil.postWithoutTippingString(title, media);
  const hash = Crypto.hash(message);
  return sdk.signMessage(hash, { returnHex: true });
};

export const blockToDate = async (goalHeight) => {
  const diff = goalHeight - (await sdk.height());
  return new Date(diff * 180000 + Date.now());
};
