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
}
