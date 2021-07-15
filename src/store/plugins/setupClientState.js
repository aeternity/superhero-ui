import persistState from './persistState';

export default (store) => {
  // eslint-disable-next-line no-underscore-dangle
  if (window.__DATA__) store.replaceState(window.__DATA__.state);

  persistState(
    (state) => state,
    ({
      selectedCurrency, address, balance, tokenBalances,
      tokenPrices, cookiesConsent,
    }) => ({
      selectedCurrency,
      address,
      balance,
      tokenBalances,
      tokenPrices,
      cookiesConsent,
    }),
  )(store);
};
