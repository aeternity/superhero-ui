// eslint-disable-next-line import/no-cycle
import store from '../store';

const wrapTry = async (promise) => {
  try {
    return promise.then((res) => {
      if (!res) {
        store.commit('setBackendStatus', false);
        return null;
      }
      store.commit('setBackendStatus', true);
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      return res.json();
    }).catch((error) => {
      console.error(error);
      return null;
    });
  } catch (err) {
    store.commit('setBackendStatus', false);
    return null;
  }
};

const backendFetch = (path, ...args) => wrapTry(
  fetch(`${process.env.VUE_APP_BACKEND_URL}/${path}`, ...args).catch((err) => console.error(err)),
);

const backendFetchNoTimeout = (path, ...args) => fetch(`${process.env.VUE_APP_BACKEND_URL}/${path}`, ...args)
  .catch((err) => console.error(err));

export default class Backend {
  static getTipComments = async (tipId) => backendFetch(`comment/api/tip/${encodeURIComponent(tipId)}`);

  static sendTipComment = async (_, postParam) => backendFetch('comment/api/', {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static getUserComments = async (address) => backendFetch(`comment/api/author/${address}`);

  static pinItem = async (address, postParam) => backendFetch(`pin/${address}`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static unPinItem = async (address, postParam) => backendFetch(`pin/${address}`, {
    method: 'delete',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static getPinnedItems = async (address) => backendFetch(`pin/${address}`);

  static getProfile = async (address) => backendFetch(`profile/${address}`);

  static sendProfileData = async (address, postParam) => backendFetch(`profile/${address}`, {
    method: 'post',
    ...postParam instanceof FormData
      ? { body: postParam }
      : {
        body: JSON.stringify(postParam),
        headers: { 'Content-Type': 'application/json' },
      },
  });

  static setImage = async (address, data) => {
    const request = {
      method: 'post',
      body: data,
    };
    return backendFetch(`profile/${address}`, request);
  };

  static claimFromUrl = async (postParam) => backendFetch('claim/submit', {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static sendPostReport = async (author, postParam) => backendFetch('blacklist/api/wallet', {
    method: 'post',
    body: JSON.stringify({ ...postParam, author }),
    headers: { 'Content-Type': 'application/json' },
  });

  static getProfileImageUrl = (address) => `${process.env.VUE_APP_BACKEND_URL}/profile/image/${address}`;

  static getStats = async () => backendFetch('static/stats/');

  static getCacheTipById = async (id) => backendFetch(`cache/tip?id=${id}`);

  static getCacheUserStats = async (address) => backendFetch(`cache/userStats?address=${address}`);

  static getCacheFeed = async (
    page,
    ordering,
    address = null,
    search = null,
    blacklist = true,
    tips = true,
    posts = true,
  ) => {
    let query = `?ordering=${ordering}&page=${page}`;
    if (tips) query += '&contractVersion=v1&contractVersion=v2';
    if (posts) query += '&contractVersion=v3';
    if (address) query += `&address=${address}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    query += `&blacklist=${blacklist}`;
    // soon change 'tips' to 'feed'
    return backendFetch(`cache/tips${query}`);
  };

  static addToken = async (address) => backendFetchNoTimeout('tokenCache/addToken', {
    method: 'post',
    body: JSON.stringify({ address }),
    headers: { 'Content-Type': 'application/json' },
  });

  static getCacheStats = async () => backendFetch('cache/stats');

  static getCacheChainNames = async () => backendFetch('cache/chainnames');

  static getPrice = async () => backendFetch('cache/price');

  static getOracleCache = async () => backendFetch('cache/oracle');

  static getTopicsCache = async () => backendFetch('cache/topics');

  static getTokenInfo = async () => backendFetch('tokenCache/tokenInfo');

  static getWordRegistry = async () => backendFetch('tokenCache/wordRegistry');

  static getWordSaleVotesDetails = async (address) => backendFetch(`tokenCache/wordSaleVotesDetails?address=${address}`);

  static getWordSaleDetailsByToken = async (address) => backendFetch(`tokenCache/wordSaleByToken?address=${address}`);

  static getWordSale = async (address) => backendFetch(`tokenCache/wordSale?address=${address}`);

  static getTokenBalances = async (address) => backendFetch(`tokenCache/balances?address=${address}`);

  static cacheInvalidateTips = async () => backendFetch('cache/invalidate/tips');

  static invalidateTokenCache = async (token) => backendFetch(`cache/invalidate/token/${token}`);

  static invalidateWordSaleCache = async (wordSale) => backendFetch(`cache/invalidate/wordSale/${wordSale}`);

  static invalidateWordRegistryCache = async () => backendFetch('cache/invalidate/wordRegistry');

  static invalidateWordSaleVotesCache = async (wordSale) => backendFetch(`cache/invalidate/wordSaleVotes/${wordSale}`);

  static invalidateWordSaleVoteStateCache = async (vote) => backendFetch(`cache/invalidate/wordSaleVoteState/${vote}`);

  static getCommentCountForAddress = async (address) => backendFetch(`comment/count/author/${address}`);

  static getTipPreviewUrl = (previewLink) => `${process.env.VUE_APP_BACKEND_URL}${previewLink}`;

  static getCommentById = async (id) => backendFetch(`comment/api/${id}`);

  static getVerifiedUrls = async () => backendFetch('verified');

  static getGrayListedUrls = async () => backendFetch('static/wallet/graylist');

  static getTipTraceBackend = (id) => backendFetch(`tracing/backend?id=${id}`);

  static getTipTraceBlockchain = (id) => backendFetch(`tracing/blockchain?id=${id}`);

  static getCookiesConsent = async (address, query) => backendFetch(`consent/${address}${query ? `?challenge=${query.challenge}&signature=${query.signature}` : ''}`);

  static setCookiesConsent = async (address, { scope, status }) => backendFetch(`consent/${address}/${scope}`, {
    method: 'post',
    body: JSON.stringify({ status: status ? 'ALLOWED' : 'REJECTED' }),
    headers: { 'Content-Type': 'application/json' },
  });

  static sendPostWithoutTip = async (postParam) => backendFetch('payfortx/post', {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });
}
