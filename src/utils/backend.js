import { BACKEND_URL } from '../config/constants';
import { wrapTry } from './util';

export default class Backend {
  getTipComments = async (tipId) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/tip/${encodeURIComponent(tipId)}`));

  sendTipComment = async (postParam) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  getAllComments = async () => wrapTry(async () => fetch(`${BACKEND_URL}/comment/api/`));

  getProfile = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/profile/${address}`));

  sendProfileData = async (postParam) => wrapTry(async () => fetch(`${BACKEND_URL}/profile`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  setProfileImage = async (address, data, image = true) => wrapTry(async () => {
    const request = {
      method: 'post',
      body: image ? data : JSON.stringify(data),
    };
    Object.assign(request, !image && { headers: { 'Content-Type': 'application/json' } });
    console.log(request);
    return fetch(this.getProfileImageUrl(address), request);
  });

  getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;

  getStats = async () => wrapTry(async () => fetch(`${BACKEND_URL}/static/stats/`));

  static getCacheTips = async (ordering, page) => wrapTry(async () => fetch(`${BACKEND_URL}/cache/tips?ordering=${ordering}&page=${page}`));

  static getCacheStats = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/stats`));

  static getCacheChainNames = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/chainnames`));

  static getPrice = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/price`));

  static getOracleCache = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/oracle`));

  static getTopicsCache = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/topics`));

  cacheInvalidateTips = async () => wrapTry(async () => fetch(`${BACKEND_URL}/cache/invalidate/tips`));

  getCommentCountForAddress = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/count/author/${address}`));

  static getTipPreviewUrl = (previewLink) => `${BACKEND_URL}${previewLink}`;

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;
}
