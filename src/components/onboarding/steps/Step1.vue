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
      Social Sharing With A Mission.
    </h1>
    <p>
      Welcome to the free web - where you are free to transact as you please.
      Never be censored again by centralized content monetization platforms.
      At Superhero, there are no third-party custodians to dictate what can and
      cannot be monetized - it doesn’t matter whether we like you or not.
    </p>
    <blockquote>
      A journey of a thousand miles begins with a single step
      <cite>Lao Tzu</cite>
    </blockquote>
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
