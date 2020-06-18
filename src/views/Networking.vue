<template>
  <Page class="league-page-container">
    <input
      v-model="room"
      :placeholder="$t('Networking.Placeholder')"
    >
    <router-link :to="'/league/' + room">
      {{ $t('Networking.Start') }}
    </router-link>
  </Page>
</template>
<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'Networking',
  components: {
    Page,
  },
  data: () => ({
    room: '',
  }),
};
</script>
<style lang="scss" scoped>
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
