<template>
  <Page class="league-page-container">
    <div
      class="networking-page"
    >
      <input
        v-model="room"
        :placeholder="toTranslateLater.placeholder"
      >
      <button @click="newRoom(room)">
        {{ toTranslateLater.button }}
      </button>
    </div>
  </Page>
</template>
<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'League',
  components: {
    Page,
  },
  data: () => ({
    sdk: null,
    toTranslateLater: {
      placeholder: 'room name',
      button: 'Start',
    },
    room: '',
  }),
  methods: {
    newRoom() {
      this.$router.push({
        name: 'conference',
        params: {
          room: this.room,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.league-page-container {
  padding-top: 1rem;
}

.league-page {
  bottom: 0;
  position: absolute;
  top: 0;
  width: 31rem;
}

.league-page iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .league-page {
    max-width: 100vw;
    top: 3.4rem;
    width: 25rem;
  }
}
</style>
