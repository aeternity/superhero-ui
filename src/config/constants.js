export const BACKEND_URL = typeof Cypress !== 'undefined'
  ? 'https://testnet.superhero.aeternity.art'
  : 'https://test-tipping.aeternity.art';

export const EXPLORER_URL = 'https://testnet.aeternal.io/';
export const COMPILER_URL = 'https://latest.compiler.aepps.com';
export const NODE_URL = 'https://testnet.aeternity.io';

export const CONTRACT_V1_ADDRESS = window.Cypress
  ? 'ct_2GRP3xp7KWrKtZSnYfdcLnreRWrntWf5aTsxtLqpBHp71EFc3i'
  : 'ct_2Cvbf3NYZ5DLoaNYAU71t67DdXLHeSXhodkSNifhgd7Xsw28Xd';

export const CONTRACT_V2_ADDRESS = window.Cypress
  ? null
  : null;
