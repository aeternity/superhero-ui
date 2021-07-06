<template>
  <div class="user-profile">
    <BackButtonRibbon />
    <UserInfo
      :address="address"
      :backend-auth="backendAuth"
    />
    <ListOfTipsAndComments :address="address" />
  </div>
</template>

<script>
import Backend from '../utils/backend';
import backendAuthMixin from '../utils/backendAuthMixin';
import ListOfTipsAndComments from '../components/ListOfTipsAndComments.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import UserInfo from '../components/UserInfo.vue';

export default {
  components: {
    ListOfTipsAndComments,
    BackButtonRibbon,
    UserInfo,
  },
  mixins: [backendAuthMixin()],
  props: {
    address: { type: String, required: true },
  },
  data: () => ({ name: null }),
  async mounted() {
    const { preferredChainName } = await Backend.getProfile(this.address);
    this.name = preferredChainName || this.$t('FellowSuperhero');
  },
  metaInfo() {
    return { title: this.name };
  },
};
</script>
