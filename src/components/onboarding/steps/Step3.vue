<template>
  <div class="step__content step_3">
    <div class="step__figure">
      <img
        src="../../../assets/step_3_Image.svg"
        alt=""
      >
    </div>
    <h1>
      Receive Tips:<br>
      Making the Internet a Fairer Place
    </h1>
    <p>
      After your Superhero wallet is installed:<br>
      <span class="highlited">1. Paste your wallet address</span>
      somewhere on your public site.<br>
      <span class="highlited">2. Open your URL</span>
      and you will instantly collect the received tips.
    </p>
    <p class="highlited">
      People can directly support your content, cause project<br>
      or you (for simply being you) without middlemen.
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
  name: 'Step3',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>
