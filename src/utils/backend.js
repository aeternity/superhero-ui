import { wrapTry } from './util';
import { BACKEND_URL, MAINNET_URL } from '../config/constants';

export default class Backend {

  tipOrder = async () => wrapTry(async () => fetch(`${BACKEND_URL}/tiporder`));

  tipPreview = async () => wrapTry(async () => fetch(`${BACKEND_URL}/linkpreview`));

  getLangTips = async (lang = 'en') => wrapTry(async () => fetch(`${BACKEND_URL}/language/${lang}`));

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

  getProfileImage = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/profile/image/${address}`));

  getStats = async () => wrapTry(async () => fetch(`${BACKEND_URL}/static/stats/`));

  getChainNameFromAddress = async () => wrapTry(async () => fetch(`${MAINNET_URL}/middleware/names/active`));

  getCommentCounts = async () => wrapTry(async () => fetch(`${BACKEND_URL}/comment/count/tips/`));

  getCommentCountForAddress = async (address) => wrapTry(async () => fetch(`${BACKEND_URL}/comment/count/author/${address}`));
}
