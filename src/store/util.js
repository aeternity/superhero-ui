import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/prefer-default-export
export const sort = (sortBy, tips) => {
  switch (sortBy) {
    case 'hot':
      tips.sort((a, b) => b.score - a.score);
      break;
    case 'latest':
      tips.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'highest':
      tips.sort((a, b) => new BigNumber(b.total_amount).minus(a.total_amount).toNumber());
      break;
    default:
  }

  return tips;
};
