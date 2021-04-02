import BigNumber from 'bignumber.js';
import { shiftDecimalPlaces } from '../utils';

export default {
  roundedTokenAmount: ({ tokenInfo }) => (amount, token, round = 2) => {
    const shiftedAmount = shiftDecimalPlaces(amount,
      -(tokenInfo[token] ? tokenInfo[token].decimals : 18));
    return new BigNumber(shiftedAmount).toFixed(round);
  },
  isLoggedIn: (state) => !!state.address,
};
