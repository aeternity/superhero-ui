import { wrapTry } from './index';

const backendFetch = (path, ...args) => wrapTry(
  fetch(`${process.env.VUE_APP_MIDDLEWARE_URL}/${path}`, ...args).catch((err) => console.error(err)),
);

export default class Middleware {
  static getAex9Balance = async (token, account) => backendFetch(`aex9/balance/${token}/${account}?top=true`);
}
