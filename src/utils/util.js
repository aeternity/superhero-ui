import { get } from 'lodash-es';
import BigNumber from 'bignumber.js';
import { EventBus } from './eventBus';
import { i18n } from './i18nHelper';

const atomsToAe = (atoms) => (new BigNumber(atoms)).dividedBy(new BigNumber(1000000000000000000));
const aeToAtoms = (ae) => (new BigNumber(ae)).times(new BigNumber(1000000000000000000));
export const wrapTry = async (promise) => {
  try {
    return Promise.race([
      promise.then((res) => {
        if (!res) {
          EventBus.$emit('backendError');
          return null;
        }
        EventBus.$emit('backendLive');
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        return res.json();
      }).catch((error) => {
        console.error(error);
        return null;
      }),
      new Promise(((resolve, reject) => {
        setTimeout(reject, 10000, 'TIMEOUT');
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

export const AVATAR_CONFIG = {
  mode: 'exclude',
  accessoriesChance: 28,
  facialHairChance: 27,
  eyes: ['cry', 'close'],
  eyebrow: ['angry', 'sad', 'unibrow'],
  mouth: ['concerned', 'vomit', 'disbelief', 'grimace', 'sad', 'scream'],
  base64: true,
};

export const createDeepLinkUrl = ({ type, ...params }) => {
  const url = new URL(`${process.env.VUE_APP_WALLET_URL}/${type}`);
  Object.entries(params)
    .filter(([, value]) => ![undefined, null].includes(value))
    .forEach(([name, value]) => url.searchParams.set(name, value));
  url.searchParams.set('x-success', window.location);
  url.searchParams.set('x-cancel', window.location);
  return url;
};

const getTwitterAccountUrl = (url) => {
  const match = url.match(/https:\/\/twitter.com\/[a-zA-Z0-9_]+/g);
  return match ? match[0] : false;
};

export const urlStatus = (tipUrl, verifiedUrls, blacklistedUrls) => {
  if (!tipUrl) return 'default';
  const twitterProfile = getTwitterAccountUrl(tipUrl);
  const url = twitterProfile || tipUrl;
  let status;
  if (blacklistedUrls.some((u) => url.includes(u))) {
    status = 'blacklisted';
  } else if (verifiedUrls.includes(url)) {
    status = 'verified';
  } else {
    status = 'not-verified';
  }
  return status;
};

export const isTitle = (index, page) => !!get(i18n.t(`views.${page}.sections[${index}]`), 'title');

export const getI18nPath = (index, page) => (isTitle(index, page)
  ? `views.${page}.sections[${index}].title`
  : `views.${page}.sections[${index}].text`);

export default {
  atomsToAe,
  aeToAtoms,
  range,
  wrapTry,
  currencySigns,
  createDeepLinkUrl,
  urlStatus,
  isTitle,
  getI18nPath,
};
