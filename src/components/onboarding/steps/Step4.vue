<template>
  <div class="step__content step_4">
    <div class="step__figure">
      <img
        src="../../../assets/step_4_Image.svg"
        alt=""
      >
    </div>
    <h1>
      Send Tips:<br>
      Making the Internet a Better Place
    </h1>
    <p>
      After your Superhero wallet is installed<br>
      <span class="important">1. Paste any URL</span> you want to support.<br>
      <span class="important">2. Add a message</span> if you want.
    </p>
    <p class="highlited">
      You can directly support any person's content, cause,<br>
      project at any URL with no middleman.<br>
      (Yes - ANY URL on the web or on <a href="https://superhero.com">www.superhero.com</a>.)
    </p>
    <div class="step__footer">
      <button
        class="button"
        @click="nextStep()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step4',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
