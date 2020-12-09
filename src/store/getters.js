import BigNumber from 'bignumber.js';
import { atomsToAe, shiftDecimalPlaces } from '../utils';

export default {
  roundedTokenAmount: ({ tokenInfo }) => (amount, token, round = 2, aettos = false) => {
    let tokenAmount = 0;
    if (token && tokenInfo[token]) {
      tokenAmount = shiftDecimalPlaces(amount, -tokenInfo[token].decimals);
    } else {
      tokenAmount = aettos ? atomsToAe(amount) : amount;
    }
    return new BigNumber(tokenAmount).toFixed(round);
  },
  isLoggedIn: (state) => !!state.address,
};
