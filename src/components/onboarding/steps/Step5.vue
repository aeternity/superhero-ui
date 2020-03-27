<template>
  <div class="step__content step_5">
    <div class="step__figure">
      <img
        src="../../../assets/step_5_Image.svg"
        alt=""
      >
    </div>
    <h1>Welcome to the Superhero League!</h1>
    <p>
      You can now get in on the action by setting your<br>
      personalized profile and preferences on
      <a href="https://superhero.com">www.superhero.com</a>
    </p>
    <div class="step__footer">
      <button
        class="button"
        v-if="!isLoggedIn"
        @click="nextStep()"
      >
        Create Profile
      </button>
      <button
        class="button"
        v-else
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
