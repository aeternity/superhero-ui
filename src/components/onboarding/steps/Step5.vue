<template>
  <div class="step__content step_5">
    <div class="step__figure">
      <img src="../../../assets/step_5_Image.svg" alt="">
    </div>
    <h1>Welcome To The Superhero League!</h1>
    <p>
      Being all said and set you can now enter your account on<br>
      <a href="https://superhero.com">Superhero.com</a> and set up your
      personalized profile preferences.
    </p>
    <div class="step__footer">
      <button v-if="!isLoggedIn" class="button" disabled="disabled">Set Up Your Profile</button>
      <button v-else class="button" @click="nextStep()">Set Up Your Profile</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Step5',
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
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
