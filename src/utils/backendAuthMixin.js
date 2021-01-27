import { mapState } from 'vuex';

export default (ignoreCallInQuery) => ({
  computed: {
    ...mapState({ currentAddress: 'address' }),
    ...mapState('aeternity', ['useSdkWallet']),
  },
  created() {
    if (!ignoreCallInQuery) this.deepLinkAuth();
  },
  methods: {
    async backendAuth(method, arg, to) {
      await this.$store.dispatch(
        'backend/callWithAuth', { method, arg, to: to && this.$router.resolve(to).href },
      );
    },
    async deepLinkAuth() {
      const {
        method, address, challenge, signature,
      } = this.$route.query;
      if (!method || !address || !challenge || !signature) {
        return;
      }
      try {
        await this.$store.dispatch(`backend/${method}`, address, { challenge, signature });
      } catch (error) {
        console.log({ 'backend/error': error });
        // this.$store.dispatch('backend/error', error);
      } finally {
        if (this.handleBackendSucceedCall) this.handleBackendSucceedCall(method);
        this.$router.replace(window.location.pathname);
      }
    },
  },
});
