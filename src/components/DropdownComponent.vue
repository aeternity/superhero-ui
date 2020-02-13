<template>
  <div class="aggregator__dropdown">
    <b-form-select v-model="selectedVal" :options="optionsVal" @change="method.call()"></b-form-select>
  </div>
</template>

<script>
  export default {
    name: 'vue-dropdown',
    props: {
      options: { type: Array },
      selected: { type: Number },
      method: { type: Function },
    },
    data() {
      return {
        selectedVal: this.selected,
        optionsVal: this.options
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/base";
.aggregator__dropdown{
  display: inline-block;
  margin: unset;
  select{
    background: none;
    background-color: $background_color;
    color: $primary_color;
    font-size: .75rem;
    border: none;
    &:focus{
      color: $primary_color;
    }
  }
}
</style>
