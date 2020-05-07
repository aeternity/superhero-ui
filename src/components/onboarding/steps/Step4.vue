<template>
  <div class="step__content step_4">
    <div class="step__figure">
      <img
        src="../../../assets/step_4_Image.svg"
        alt=""
      >
    </div>
    <i18n
      :path="$t('components.onboarding.steps.step4.header')"
      tag="h1"
    >
      <template v-slot:br>
        <br>
      </template>
    </i18n>
    <i18n
      :path="$t('components.onboarding.steps.step4.info')"
      tag="p"
    >
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:visitTheURL>
        <span class="highlited">{{ $t('components.onboarding.steps.step4.visitTheURL') }}</span>
      </template>
      <template v-slot:clickSendTips>
        <span class="highlited">{{ $t('components.onboarding.steps.step4.clickSendTips') }}</span>
      </template>
      <template v-slot:enterTipAmount>
        <span class="highlited">{{ $t('components.onboarding.steps.step4.enterTipAmount') }}</span>
      </template>
    </i18n>
    <i18n
      class="highlited"
      :path="$t('components.onboarding.steps.step4.youCanDirectlySupport')"
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
        class="button"
        @click="nextStep"
      >
        {{ $t('components.onboarding.steps.next') }}
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
