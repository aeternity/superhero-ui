import { get } from 'lodash-es';
import BigNumber from 'bignumber.js';
import isFQDN from 'is-fqdn';
import i18n from './i18nHelper';

export const topicsRegex = /(#[a-zA-Z]+\b)(?!;)/g;

export const shiftDecimalPlaces = (amount, decimals) => new BigNumber(amount).shiftedBy(decimals);

export const atomsToAe = (atoms) => shiftDecimalPlaces(atoms, -18);
export const aeToAtoms = (ae) => shiftDecimalPlaces(ae, 18);

export const currencySigns = {
  eur: '€',
  usd: '$',
  cny: '¥',
};

export const IS_MOBILE_DEVICE = !process.env.VUE_CLI_SSR && window.navigator.userAgent.includes('Mobi');
export const IS_FRAME = !process.env.VUE_CLI_SSR && window.parent !== window;

export const IDENTICON_CONFIG = {
  lightness: {
    color: [0.4, 1.0],
    grayscale: [0.5, 1.0],
  },
  saturation: {
    color: 1.0,
    grayscale: 1.0,
  },
  backColor: '#0F0F0Fff',
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
  const currentUrl = process.env.VUE_CLI_SSR ? 'http://superhero.com' : window.location;
  url.searchParams.set('x-success', currentUrl);
  url.searchParams.set('x-cancel', currentUrl);
  Object.entries(params)
    .filter(([, value]) => ![undefined, null].includes(value))
    .forEach(([name, value]) => url.searchParams.set(name, value));
  return url;
};

export const toURL = (url) => new URL(url.includes('://') ? url : `https://${url}`);

export const validateTipUrl = (urlAsString) => {
  try {
    const url = toURL(urlAsString);
    return ['http:', 'https:'].includes(url.protocol) && isFQDN(url.hostname);
  } catch (e) {
    return false;
  }
};

const getTwitterAccountUrl = (url) => {
  const match = url.match(/https:\/\/twitter.com\/[a-zA-Z0-9_]+/g);
  return match ? match[0] : false;
};

export const urlStatus = (tipUrl, verifiedUrls, blacklistedUrls) => {
  if (!tipUrl) return 'default';
  const twitterProfile = getTwitterAccountUrl(tipUrl);
  const url = twitterProfile || tipUrl;

  if (blacklistedUrls.some((u) => url.includes(u))) return 'blacklisted';
  if (verifiedUrls.includes(url)) return 'verified';
  if (validateTipUrl(url) && url.startsWith('http:')) return 'not-secure';
  return 'not-verified';
};

export const isTitle = (index, page) => !!get(i18n.t(`views.${page}.sections[${index}]`), 'title');

export const getI18nPath = (index, page) => (isTitle(index, page)
  ? `views.${page}.sections[${index}].title`
  : `views.${page}.sections[${index}].text`);

export const handleUnknownError = (error) => console.warn('Unknown rejection', error);

export const blockToDate = (goalBlock, height) => {
  const diff = goalBlock - height;
  return new Date(diff * 180000 + Date.now());
};

export const wrapTry = async (promise, store) => {
  try {
    return promise.then((res) => {
      if (!res) {
        if (store) { store.commit('setBackendStatus', false); }
        return null;
      }
      if (store) { store.commit('setBackendStatus', true); }
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      return res.json();
    }).catch((error) => {
      console.error(error);
      return null;
    });
  } catch (err) {
    if (store) { store.commit('setBackendStatus', false); }
    return null;
  }
};
