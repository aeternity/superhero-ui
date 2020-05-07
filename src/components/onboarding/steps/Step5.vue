<template>
  <div class="step__content step_5">
    <div class="step__figure">
      <img
        src="../../../assets/step_5_Image.svg"
        alt=""
      >
    </div>
    <h1>{{ $t('components.onboarding.steps.step5.header') }}</h1>
    <i18n
      :path="$t('components.onboarding.steps.step5.info')"
      tag="p"
    >
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:superherocom>
        <a href="https://superhero.com">www.superhero.com</a>
      </template>
    </i18n>
    <div class="step__footer">
      <button
        v-if="!isLoggedIn"
        class="button"
        @click="nextStep"
      >
        {{ $t('components.onboarding.steps.step5.installWallet') }}
      </button>
      <button
        v-else
        class="button"
        @click="isLoggedIn && nextStep()"
      >
        {{ $t('components.onboarding.steps.step5.setUpProfile') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Step5',
  computed: mapGetters(['isLoggedIn']),
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
