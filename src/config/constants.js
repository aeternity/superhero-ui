export const BACKEND_URL = typeof Cypress !== 'undefined' ? 'https://testnet.superhero.aeternity.art' : 'https://test-tipping.aeternity.art';
export const MIDDLEWARE_URL = 'https://testnet.aeternity.io/';
export const EXPLORER_URL = 'https://testnet.aeternal.io/';
export const COMPILER_URL = 'https://latest.compiler.aepps.com';
export const NODE_URL = 'https://mainnet.aeternity.io';

export const CONTRACT_ADDRESS = window.Cypress
  ? 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i'
  : 'ct_2AfnEfCSZCTEkxL5Yoi4Yfq6fF7YapHRaFKDJK3THMXMBspp5z';
