<template>
  <div class="step__content step_3">
    <div class="step__figure">
      <img
        src="../../../assets/step_3_Image.svg"
        alt=""
      >
    </div>
    <h1>Receive Tips From Your Supporters</h1>
    <p>
      Whether it be for awesome content, good causes, research, fundraising, or for simply being
      funny—you earn what you deserve for taking part in making the Internet a better place.
    </p>
    <ol>
      <li>Install the Superhero wallet extension.</li>
      <li>Paste your wallet address to your URL.</li>
      <li>Load your URL so your wallet can instantly collect all tips sent to you...</li>
    </ol>
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
  name: 'Step3',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
