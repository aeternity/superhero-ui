<template>
  <div>
    <right-section></right-section>
    <left-section></left-section>
    <loading class="mt-5" :show-loading="true"/>
  </div>
</template>

<script>
  import LeftSection from '../components/layout/LeftSection.vue';
  import RightSection from '../components/layout/RightSection.vue';
  import Loading from '../components/Loading.vue';
  import { EventBus } from "../utils/eventBus";

  export default {
    name: 'LoadingView',
    components: {
      LeftSection,
      RightSection,
      Loading
    },
    created() {
      EventBus.$on("walletFound", () => {
        this.$router.push({name: 'home'})
      });
    }
  }
</script>
