import BigNumber from 'bignumber.js';
import { atomsToAe, shiftDecimalPlaces } from '../utils';

export default {
  roundedTokenAmount: ({ tokenInfo }) => (amount, token, round = 2, aettos = false) => {
    let tokenAmount;
    if (token) {
      tokenAmount = tokenInfo[token] ? shiftDecimalPlaces(amount, -tokenInfo[token].decimals) : 0;
    } else {
      tokenAmount = aettos ? atomsToAe(amount) : amount;
    }
    return new BigNumber(tokenAmount).toFixed(round);
  },
  isLoggedIn: (state) => !!state.address,
};
