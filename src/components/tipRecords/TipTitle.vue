<template>
  <div>
    <div class="title" v-for="part in splitByTopics">
      <topic v-if="part.matches" :topic="part.text"></topic>
      <span @click="goToTip(tip.id)" v-else>{{part.text}}</span>
    </div>
  </div>
</template>

<script>

  import TippingContractUtil from '../../utils/tippingContractUtil';
  import Topic from "./Topic";

  export default {
    name: 'TipTitle',
    components: {Topic},
    props: ['tip', 'goToTip'],
    computed: {
      splitByTopics() {
        return this.tip.title.split(TippingContractUtil.topicsRegex).map(part => {
          const matches = TippingContractUtil.topicsRegex.test(part);

          return {
            text: part,
            matches: matches
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    display: inline;

    .topiclink {
      color: $custom_links_color;
    }
  }

</style>
