import { wrapTry } from './util';

export default class Backend {
  BACKEND_URL;

  MAINNET_URL;

  constructor() {
    this.BACKEND_URL = typeof Cypress !== 'undefined' ? 'http://localhost' : 'https://raendom-backend.z52da5wt.xyz';
    this.MAINNET_URL = 'https://mainnet.aeternal.io/';
  }

  tipOrder = async () => wrapTry(async () => fetch(`${this.BACKEND_URL}/tiporder`));

  tipPreview = async () => wrapTry(async () => fetch(`${this.BACKEND_URL}/linkpreview`));

  getLangTips = async (lang = 'en') => wrapTry(async () => fetch(`${this.BACKEND_URL}/language/${lang}`));

  getTipComments = async (tipId) => wrapTry(async () => fetch(`${this.BACKEND_URL}/comment/api/tip/${encodeURIComponent(tipId)}`));

  sendTipComment = async (postParam) => wrapTry(async () => fetch(`${this.BACKEND_URL}/comment/api/`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  getAllComments = async () => wrapTry(async () => fetch(`${this.BACKEND_URL}/comment/api/`));

  getProfile = async (address) => wrapTry(async () => fetch(`${this.BACKEND_URL}/profile/${address}`));

  sendProfileData = async (postParam) => wrapTry(async () => fetch(`${this.BACKEND_URL}/profile`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  }));

  getProfileImage = async (address) => wrapTry(async () => fetch(`${this.BACKEND_URL}/profile/image/${address}`));

  getStats = async () => wrapTry(async () => fetch(`${this.BACKEND_URL}/static/stats/`));

  getChainNameFromAddress = async () => wrapTry(async () => fetch(`${this.MAINNET_URL}/middleware/names/active`));

  getCommentCounts = async () => wrapTry(async () => fetch(`${this.BACKEND_URL}/comment/count/tips/`));

  getCommentCountForAddress = async (address) => wrapTry(async () => fetch(`${this.BACKEND_URL}/comment/count/author/${address}`));
}
