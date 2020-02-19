const wrapTry = async (f) => {
  try {
    return Promise.race([
      f().then(res => {
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        return res.json()
      }),
      new Promise(function (resolve, reject) {
        setTimeout(reject, 8000, 'TIMEOUT');
      })
    ])
  } catch (e) {
    console.error("backend error", e);
    return null;
  }
};

export default class Currency {

  CURRENCY_URL;

  constructor() {
    this.CURRENCY_URL = "https://api.coingecko.com/api/v3/simple/price?ids=aeternity&vs_currencies=usd,eur,cny";
  }

  getRates = async () => wrapTry(async () => {
    return fetch(`${this.CURRENCY_URL}`);
  });
}
