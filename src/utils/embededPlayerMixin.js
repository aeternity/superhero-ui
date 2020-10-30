import backendAuthMixin from './backendAuthMixin';

export default {
  mixins: [backendAuthMixin()],
  data() {
    return {
      isPlaying: false,
      showCookiesDialog: false,
    };
  },
  methods: {
    checkForAllowed(scope) {
      if (!this.$store.state.cookiesList) {
        return false;
      }
      const entry = this.$store.state.cookiesList.find((p) => p.scope === scope);
      if (!entry) {
        return false;
      }
      return entry.status === 'ALLOWED';
    },
    async play(scope) {
      if (this.checkForAllowed(scope)) {
        this.isPlaying = true;
      } else {
        this.showCookiesDialog = true;
      }
    },
  },
};
