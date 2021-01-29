const wrapTry = async (promise) => {
  try {
    return promise.then((res) => {
      if (!res) {
        return null;
      }
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      return res.json();
    }).catch((error) => {
      console.error(error);
      return null;
    });
  } catch (err) {
    return null;
  }
};

const backendFetch = (path, ...args) => wrapTry(
  fetch(`${process.env.VUE_APP_MIDDLEWARE_URL}/${path}`, ...args).catch((err) => console.error(err)),
);

export default class Middleware {
  static getAex9Balance = async (token, account) => backendFetch(`aex9/balance/${token}/${account}?top=true`);
}
