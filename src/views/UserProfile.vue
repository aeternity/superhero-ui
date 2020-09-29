<template>
  <div class="profile__page">
    <BackButtonRibbon />
    <UserInfo :address="address" />
    <ListOfTipsAndComments :address="address" />
  </div>
</template>

<script>
import ListOfTipsAndComments from '../components/ListOfTipsAndComments.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import UserInfo from '../components/UserInfo.vue';

export default {
  components: {
    ListOfTipsAndComments,
    BackButtonRibbon,
    UserInfo,
  },
  props: {
    address: { type: String, required: true },
  },
};
</script>
