<template>
  <span @click="searchTopic(topic)" :title="topic" class="topic">{{topic}}</span>
</template>

<script>
  import { EventBus } from "../../utils/eventBus";

  export default {
    name: 'Topic',
    props: ['topic'],
    methods: {
      searchTopic(topic) {
        if(this.$route.name !== 'home'){
          this.$router.push({
            name: 'home',
            query: { searchTopicPhrase: topic }
          });
        }else{
          EventBus.$emit('searchTopic', topic)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../styles/base";

  .topic{
    color: #67B6F7;
    &:hover{
      cursor: pointer;
    }
  }
</style>
