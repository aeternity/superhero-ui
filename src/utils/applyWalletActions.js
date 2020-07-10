import Backend from './backend';
import { createDeepLinkUrl } from './util';

export const applyBackendChanges = async (method, request, requestParams, cb) => {
  const args = {
    sendProfileData: [...requestParams, request],
    pinItem: [...requestParams, request],
    unPinItem: [...requestParams, request],
    sendPostReport: [request],
  }[method];
  if (!args) throw new Error(`Unknown method: ${method}`);
  await Backend[method](...args);
  if (cb) cb();
};

export const backendAuth = async (method, challenge, client, requestParams, url, cb) => {
  if (client && client.rpcClient) {
    const signature = await client.signMessage(challenge);
    applyBackendChanges(method, { challenge, signature }, requestParams, cb);
  } else {
    const cbUrl = url || new URL(window.location);
    cbUrl.search = '';
    window.location = createDeepLinkUrl({
      type: 'sign-message',
      message: challenge,
      'x-success': `${cbUrl}?method=${method}&challenge=${challenge}&signature={signature}`,
    });
  }
};
