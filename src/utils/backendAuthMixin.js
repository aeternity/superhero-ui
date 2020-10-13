import { mapState } from 'vuex';
import Backend from './backend';
import { createDeepLinkUrl } from './index';
import { client } from './aeternity';

export default (ignoreCallInQuery) => ({
  computed: mapState({
    useSdkWallet: 'useSdkWallet',
    currentAddress: 'address',
  }),
  ...!ignoreCallInQuery && {
    async beforeRouteEnter(to, from, next) {
      const {
        method, address, challenge, signature,
      } = to.query;
      if (!method || !address || !challenge || !signature) {
        next();
        return;
      }
      let succeed = false;
      try {
        await Backend[method](address, { challenge, signature });
        succeed = true;
      } finally {
        next((vm) => {
          if (succeed && vm.handleBackendSucceedCall) vm.handleBackendSucceedCall(method);
          vm.$router.replace(window.location.pathname);
        });
      }
    },
  },
  methods: {
    async backendAuth(method, arg, to) {
      const { challenge } = await Backend[method](this.address, arg);
      if (this.useSdkWallet) {
        const signature = await client.signMessage(challenge);
        await Backend[method](this.address, { challenge, signature });
        return;
      }

      const url = new URL(to ? this.$router.resolve(to).href : window.location, window.location);
      url.search = '';
      window.location = createDeepLinkUrl({
        type: 'sign-message',
        message: challenge,
        'x-success': `${url}?method=${method}&address=${this.address}&challenge=${challenge}&signature={signature}`,
      });
    },
  },
});
