<template>
  <div class="conference">
    <Loading v-if="loading" />
    <div
      v-show="!loading"
      ref="jitsi"
      class="jitsi-container"
    />
  </div>
</template>
<script>
import { BrowserWindowMessageConnection } from '@aeternity/aepp-sdk';
import Loading from '../components/Loading.vue';

export default {
  components: { Loading },
  props: {
    room: { type: String, default: '' },
  },
  data: () => ({
    loading: true,
    jitsi: null,
  }),
  watch: {
    room() {
      this.loading = true;
      this.jitsi.dispose();
      this.initJitsi();
    },
  },
  created() {
    if (this.$isMobileDevice) {
      const url = `https://${process.env.VUE_APP_JITSI_HOST}/${this.room || ''}`;
      // TODO: Remove after solving https://github.com/universal-vue/uvue/pull/64
      if (this.$context.isClient) {
        window.location = url;
        return;
      }
      this.$redirect(url, 302);
    }
  },
  async mounted() {
    this.initJitsi();

    const connection = await BrowserWindowMessageConnection({
      origin: `https://${process.env.VUE_APP_JITSI_HOST}`,
    });

    connection.connect(({ room }) => {
      this.$router.push({ name: 'conference', params: { room } });
    });

    this.$once('hook:destroyed', () => {
      connection.disconnect();
      this.jitsi.dispose();
    });
  },
  methods: {
    async initJitsi() {
      // TODO fix the jitsi integration
    },
  },
  metaInfo: {
    title: 'Conference',
  },
};
</script>
<style lang="scss" scoped>
.conference {
  display: flex;

  .loading {
    margin: auto;
  }

  .jitsi-container {
    flex-grow: 1;
    scrollbar-width: none;
  }
}
</style>
