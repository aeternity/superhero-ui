import { BACKEND_URL } from '../config/constants';
import { wrapTry } from './util';

const backendFetch = (path, ...args) => wrapTry(fetch(`${BACKEND_URL}/${path}`, ...args));

export default class Backend {
  static getTipComments = async (tipId) => backendFetch(`comment/api/tip/${encodeURIComponent(tipId)}`);

  static async sendTipComment(tipId, text, author, signCb, parentId) {
    const sendComment = async (postParam) => backendFetch('comment/api/', {
      method: 'post',
      body: JSON.stringify(postParam),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseChallenge = await sendComment({ tipId, text, author });
    const signedChallenge = await signCb(responseChallenge.challenge);
    const respondChallenge = {
      challenge: responseChallenge.challenge,
      signature: signedChallenge,
      parentId,
    };

    return sendComment(respondChallenge);
  }

  static getAllComments = async () => backendFetch('comment/api/');

  static getProfile = async (address) => backendFetch(`profile/${address}`);

  static sendProfileData = async (postParam) => backendFetch('profile', {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static setProfileImage = async (address, data, image = true) => {
    const request = {
      method: 'post',
      body: image ? data : JSON.stringify(data),
    };
    Object.assign(request, !image && { headers: { 'Content-Type': 'application/json' } });
    return wrapTry(fetch(Backend.getProfileImageUrl(address), request));
  };

  static deleteProfileImage = async (address, postParam = false) => {
    const request = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      ...postParam && { body: JSON.stringify(postParam) },
    };
    return backendFetch(`profile/image/${address}`, request);
  };

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;

  static getStats = async () => backendFetch('static/stats/');

  static getCacheTipById = async (id) => backendFetch(`cache/tip?id=${id}`);

  static getCacheUserStats = async (address) => backendFetch(`cache/userStats?address=${address}`);

  static getCacheTips = async (ordering, page, address = null, search = null) => {
    let query = `?ordering=${ordering}&page=${page}`;
    if (address) query += `&address=${address}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;

    return backendFetch(`cache/tips${query}`);
  };

  static getCacheStats = async () => backendFetch('cache/stats');

  static getCacheChainNames = async () => backendFetch('cache/chainnames');

  static getPrice = async () => backendFetch('cache/price');

  static getOracleCache = async () => backendFetch('cache/oracle');

  static getTopicsCache = async () => backendFetch('cache/topics');

  static cacheInvalidateTips = async () => backendFetch('cache/invalidate/tips');

  static getCommentCountForAddress = async (address) => backendFetch(`comment/count/author/${address}`);

  static getTipPreviewUrl = (previewLink) => `${BACKEND_URL}${previewLink}`;

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;

  static getCommentById = async (id) => backendFetch(`comment/api/${id}`);
}
