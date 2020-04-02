import { BACKEND_URL } from '../config/constants';
import { wrapTry } from './util';

export default class Backend {
  static getTipComments = async (tipId) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/tip/${encodeURIComponent(tipId)}`));

  static sendTipComment = async (postParam) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  static getAllComments = async () => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/`));

  static getProfile = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/profile/${address}`));

  static sendProfileData = async (postParam) => wrapTry(async () => fetch(`${BACKEND_URL}/profile`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  static setProfileImage = async (address, data, image = true) => wrapTry(async () => {
    const request = {
      method: 'post',
      body: image ? data : JSON.stringify(data),
    };
    Object.assign(request, !image && { headers: { 'Content-Type': 'application/json' } });
    console.log(request);
    return fetch(Backend.getProfileImageUrl(address), request);
  });

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;

  static getStats = async () => wrapTry(async () => fetch(`${BACKEND_URL}/static/stats/`));

  static getCacheTipById = async (id) => wrapTry(async () => fetch(`${BACKEND_URL}/cache/tip?id=${id}`));

  static getCacheUserStats = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/cache/userStats?address=${address}`));

  static getCacheTips = async (ordering, page, address = null, search = null) => wrapTry(
    async () => {
      let query = `?ordering=${ordering}&page=${page}`;
      if (address) query += `&address=${address}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      return fetch(`${BACKEND_URL}/cache/tips${query}`);
    },
  );

  static getCacheStats = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/stats`));

  static getCacheChainNames = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/chainnames`));

  static getPrice = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/price`));

  static getOracleCache = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/oracle`));

  static getTopicsCache = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/topics`));

  static cacheInvalidateTips = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/invalidate/tips`));

  static getCommentCountForAddress = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/count/author/${address}`));

  static getTipPreviewUrl = (previewLink) => `${BACKEND_URL}${previewLink}`;

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;
}
