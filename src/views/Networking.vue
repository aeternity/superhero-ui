<template>
  <Page class="league-page-container">
    <div
      class="networking-page"
    >
      <input
        v-model="room"
        :placeholder="$t('Networking.Placeholder')"
      >
      <router-link :to="'/league/' + room">
        {{ $t('Networking.Start') }}
      </router-link>
    </div>
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
</style>
