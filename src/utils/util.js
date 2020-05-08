import BigNumber from 'bignumber.js';
import { EventBus } from './eventBus';

const atomsToAe = (atoms) => (new BigNumber(atoms)).dividedBy(new BigNumber(1000000000000000000));
const aeToAtoms = (ae) => (new BigNumber(ae)).times(new BigNumber(1000000000000000000));
export const wrapTry = async (promise) => {
  try {
    return Promise.race([
      promise.then((res) => {
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        return res.json();
      }),
      new Promise(((resolve, reject) => {
        setTimeout(reject, 5000, 'TIMEOUT');
      })),
    ]);
  } catch (err) {
    EventBus.$emit('backendError');
    return null;
  }
};

const range = (start, end) => (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);

// eslint-disable-next-line no-extend-native, func-names
Array.prototype.asyncMap = async function (asyncF) {
  return this.reduce(async (promiseAcc, cur) => {
    const acc = await promiseAcc;
    const res = await asyncF(cur).catch((e) => {
      console.error('asyncMap asyncF', e.message);
      return null;
    });
    if (Array.isArray(res)) {
      return acc.concat(res);
    }
    if (res) acc.push(res);
    return acc;
  }, Promise.resolve([]));
};

export const supportedBrowsers = [
  'chrome', 'firefox', 'opera', 'vivaldi', 'brave', 'edge-chromium',
];

export const currencySigns = {
  eur: '€',
  usd: '$',
  cny: '¥',
};

export const IS_MOBILE_DEVICE = window.navigator.userAgent.includes('Mobi');
export const IS_FRAME = window.parent !== window;
export const USE_DEEP_LINKS = IS_MOBILE_DEVICE && !IS_FRAME;

export const IDENTICON_CONFIG = {
  lightness: {
    color: [0.4, 1.0],
    grayscale: [0.5, 1.0],
  },
  saturation: {
    color: 1.0,
    grayscale: 1.0,
  },
  backColor: '#12121bff',
};

export const createDeepLinkUrl = ({
  type, id, text, parentId,
}) => {
  const url = new URL(`${process.env.VUE_APP_WALLET_URL}/${type}`);
  if (parentId) {
    url.searchParams.set('parentId', parentId);
  }
  if (id) {
    url.searchParams.set('id', id);
  }
  if (text) {
    url.searchParams.set('text', encodeURIComponent(text));
  }
  url.searchParams.set('x-success', encodeURIComponent(window.location));
  url.searchParams.set('x-cancel', encodeURIComponent(window.location));
  return url;
};

export default {
  atomsToAe,
  aeToAtoms,
  range,
  wrapTry,
  currencySigns,
  createDeepLinkUrl,
};
