<template>
  <div>
    <div class="title" v-for="part in splitByTopics">
      <span @click="goToTip(tip.id)" v-bind:class="{ topiclink: part.matches }">{{part.text}}</span>
    </div>
  </div>
</template>

<script>

  import TippingContractUtil from '../../utils/tippingContractUtil';

  export default {
    name: 'TipTitle',
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
    },
    created() {
      console.log(this.splitByTopics);
    }
  }
</script>

<style lang="scss">
  @import "../../styles/base";

  .title {
    display: inline;

    .topiclink {
      color: $custom_links_color;
    }
  }

</style>
