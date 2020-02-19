import { wrapTry } from './util'

export default class Currency {

  CURRENCY_URL;

  constructor() {
    this.CURRENCY_URL = "https://api.coingecko.com/api/v3/simple/price?ids=aeternity&vs_currencies=usd,eur,cny";
  }

  getRates = async () => wrapTry(async () => {
    return fetch(`${this.CURRENCY_URL}`);
  });
}
