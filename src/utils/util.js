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
  url.searchParams.set('x-success', window.location);
  url.searchParams.set('x-cancel', window.location);
  Object.entries(params)
    .filter(([, value]) => ![undefined, null].includes(value))
    .forEach(([name, value]) => url.searchParams.set(name, value));
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
  wrapTry,
  currencySigns,
  createDeepLinkUrl,
  urlStatus,
  isTitle,
  getI18nPath,
};
