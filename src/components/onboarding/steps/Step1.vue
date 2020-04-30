<template>
  <div class="step__content step_1">
    <div class="step__figure">
      <img
        src="../../../assets/step_1_Image.svg"
        alt=""
      >
    </div>
    <h1>
      Introducing Superhero:<br>
      <a>A Social Platform With A Mission</a>
    </h1>
    <p>
      The first Superpower of Superhero is to launch a<br>
      <span class="important">P2P tool to receive or send a tip to any URL</span> with...
    </p>
    <p>
      <span class="important">
        Zero transaction fees by Superhero.com. Near zero fees collected by miners.
      </span>
      Cut out intermediaries,<br>
      profiting off sending or receiving support.
      <span class="important">No wait-time.</span> Transfers<br>
      are instant. <span class="important">No censorship.</span> No 3rd parties controlling the<br>
      approval nor the release of tips. Keep your IP ownership.
    </p>
    <p class="highlited">
      Welcome to a web where you can transact as you please!
    </p>
    <div class="step__footer">
      <button
        class="button"
        @click="nextStep"
      >
        Start Your Superhero Journey
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  text-align: center;
}
</style>
