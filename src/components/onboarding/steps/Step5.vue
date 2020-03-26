<template>
  <div class="step__content step_5">
    <div class="step__figure">
      <img
        src="../../../assets/step_5_Image.svg"
        alt=""
      >
    </div>
    <h1>Welcome To The Superhero League!</h1>
    <p>
      Being all said and set you can now enter your account on<br>
      <a href="https://superhero.com">Superhero.com</a> and set up your
      personalized profile preferences.
    </p>
    <p v-if="!isLoggedIn">
      *
      <a @click="gotoStep(1)">Install wallet</a> and
      <a @click="openWallet()">log in</a> to continue
    </p>
    <div class="step__footer">
      <button
        class="button"
        :disabled="!isLoggedIn"
        @click="isLoggedIn && nextStep()"
      >
        Set Up Your Profile
      </button>
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
    gotoStep(index) {
      this.$emit('wizard:goto', index);
    },
    openWallet() {
      // TODO: trigger wallet
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    text-align: center;
  }
</style>
