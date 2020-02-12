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
}
