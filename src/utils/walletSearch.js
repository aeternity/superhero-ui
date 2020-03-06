import { RpcAepp, Node } from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import aeternity from "./aeternity";

// Send wallet connection info to Aepp through content script
const NODE_URL = 'https://sdk-mainnet.aepps.com';
const NODE_INTERNAL_URL = 'https://sdk-mainnet.aepps.com';
const COMPILER_URL = 'https://latest.compiler.aepps.com';

export const wallet = {
  client: null,
  height: null,
  pub: null,
  balance: null,
  walletName: null,

  async scanForWallets ( successCallback) {
    const scannerConnection = await BrowserWindowMessageConnection({
      connectionInfo: { id: 'spy' },
    });
    const detector = await Detector({ connection: scannerConnection });
    const handleWallets = async function ({ wallets, newWallet }) {
      detector.stopScan();
      await this.client.connectToWallet(await newWallet.getConnection());
      await this.client.subscribeAddress('subscribe', 'current');
      aeternity.client = this.client;
      await aeternity.initProvider(true);
      successCallback();
    };

    detector.scan(handleWallets.bind(this));
  },

  async init (successCallback) {
    window !== window.parent;

    this.client = await RpcAepp({
      name: 'Superhero',
      nodes: [{ name: 'mainnet', instance: await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL }) }],
      compilerUrl: COMPILER_URL
    });
    this.height = await this.client.height();
    await this.scanForWallets(successCallback);
  },

  async signMessage(message) {
    const messageSig  = await wallet.client.signMessage(message);
    console.log("signed message => ", messageSig)
    const isValid = await wallet.client.verifyMessage(message, messageSig)
    console.log("message valid => ", isValid)

    const isValidAgain = await wallet.client.verifyMessage(message, messageSig)
    console.log("message valid => ", isValidAgain)
    return messageSig;
  }
};
