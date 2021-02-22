import { mapState } from 'vuex';
import Backend from './backend';

export default (ignoreCallInQuery) => ({
  computed: mapState({
    useSdkWallet: ({ aeternity: { useSdkWallet } }) => useSdkWallet,
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
      await this.$store.dispatch(
        'backend/callWithAuth', { method, arg, to: to && this.$router.resolve(to).href },
      );
    },
  },
});
