<template>
  <div class="step__content step_1">
    <div class="step__figure">
      <img
        src="../../../assets/step_1_Image.svg"
        alt=""
      >
    </div>
    <i18n path="components.onboarding.steps.step1.header" tag="h1">
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:a>
        <a>{{ $t('components.onboarding.steps.step1.socialPlatform') }}</a>
      </template>
    </i18n>
    <p>
      {{ $t('components.onboarding.steps.step1.subheader') }}
      <br>
      <span class="important">{{ $t('components.onboarding.steps.step1.P2Ptool') }}</span>
      {{ $t('components.onboarding.steps.step1.with') }}
    </p>
    <p>
      <span class="important">
        {{ $t('components.onboarding.steps.step1.zeroTxFees') }}
      </span>
      {{ $t('components.onboarding.steps.step1.cutOurIntermediaries') }}<br>
      {{ $t('components.onboarding.steps.step1.SendingorReceiving') }}
      <span class="important">{{ $t('components.onboarding.steps.step1.noWaitTime') }}</span> {{ $t('components.onboarding.steps.step1.Transfers') }}<br>
      {{ $t('components.onboarding.steps.step1.instant') }} <span class="important">{{ $t('components.onboarding.steps.step1.noCensorship') }}</span> {{ $t('components.onboarding.steps.step1.No3rdParty') }}<br>
      {{ $t('components.onboarding.steps.step1.keepIP') }}
    </p>
    <p class="highlited">
      {{ $t('components.onboarding.steps.step1.welcome') }}
    </p>
    <div class="step__footer">
      <button
        class="button"
        @click="nextStep"
      >
        {{ $t('components.onboarding.steps.step1.button') }}
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
