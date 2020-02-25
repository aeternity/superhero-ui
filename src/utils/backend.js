import { wrapTry } from './util'

export default class Backend {

  BACKEND_URL;

  constructor() {
    this.BACKEND_URL = "https://raendom-backend.z52da5wt.xyz";
  }

  tipOrder = async () => wrapTry(async () => {
    return fetch(`${this.BACKEND_URL}/tiporder`);
  });
  tipPreview = async () => wrapTry(async () => {
    return fetch(`${this.BACKEND_URL}/linkpreview`);
  });
  getLangTips = async (lang = 'en') => wrapTry(async () => {
    return fetch(`${this.BACKEND_URL}/language/` + lang); 
  });
  getTipComments = async (tipId) => wrapTry(async () => {
    return fetch(`${this.BACKEND_URL}/comment/api/tip/` + encodeURIComponent(tipId));
  });
  sendTipComment = async (postParam) => wrapTry(async () => {
    return fetch(`${this.BACKEND_URL}/comment/api/`, {
      method: 'post',
      body: JSON.stringify(postParam),
      headers: {"Content-Type": "application/json"}
    });
  });
}
