<template>
  <div class="step__content step_2">
    <div class="step__figure">
      <img
        src="../../../assets/step_2_Image.svg"
        alt=""
      >
    </div>
    <i18n
      :path="$t('components.onboarding.steps.step2.header')"
      tag="h1"
    >
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:a>
        <a
          href="https://aeternity.com/"
          target="_blank"
        >
          {{ $t('components.onboarding.steps.step2.aeternityBlockchain') }}
        </a>
      </template>
    </i18n>
    <i18n
      :path="$t('components.onboarding.steps.step2.subheader')"
      tag="p"
    >
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:peopleSupportingPeople>
        <span class="highlited">
          {{ $t('components.onboarding.steps.step2.peopleSupportingPeople') }}
        </span>
      </template>
      <template v-slot:sendTips>
        <span class="highlited">{{ $t('components.onboarding.steps.step2.sendTips') }}</span>
      </template>
      <template v-slot:receiveTips>
        <span class="highlited">{{ $t('components.onboarding.steps.step2.receiveTips') }}</span>
      </template>
      <template v-slot:getOrGiveHelp>
        <span class="highlited">{{ $t('components.onboarding.steps.step2.getOrGiveHelp') }}</span>
      </template>
    </i18n>
    <i18n
      class="highlited"
      :path="$t('components.onboarding.steps.step2.bolder')"
      tag="p"
    >
      <template v-slot:br>
        <br>
      </template>
      <template v-slot:click>
        <span class="highlited">{{ $t('components.onboarding.steps.step2.click') }}</span>
      </template>
    </i18n>
    <div class="step__wallets">
      <a
        href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
        target="_blank"
      >
        <img
          src="../../../assets/walletFirefox.svg"
          alt="Firefox"
        >
      </a>
      <a
        href="https://chrome.google.com/webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne"
        target="_blank"
      >
        <img
          src="../../../assets/walletChrome.svg"
          alt="Chrome"
        >
      </a>
      <a
        href="https://apps.apple.com/bg/app/superhero-wallet/id1502786641"
        target="_blank"
      >
        <img
          src="../../../assets/walletIOS.svg"
          alt="iOS"
        >
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.superhero.cordova"
        target="_blank"
      >
        <img
          src="../../../assets/walletAndroid.svg"
          alt="Android"
        >
      </a>
    </div>
    <p>
      {{ $t('components.onboarding.steps.step2.learnMore') }}
      <router-link
        v-slot="{ href }"
        to="/tutorial"
      >
        <a
          :href="href"
          target="_blank"
        >
          {{ $t('components.onboarding.steps.step2.tutorial') }}
        </a>
      </router-link>
      &
      <router-link
        v-slot="{ href }"
        to="/faq"
      >
        <a
          :href="href"
          target="_blank"
        >
          {{ $t('FAQ') }}
        </a>
      </router-link>
    </p>
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
  name: 'Step2',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>

<style lang="scss" scoped>
.step__wallets {
  align-items: center;
  display: flex;
  height: 2rem;
  justify-content: center;
  margin: 0.5rem 0 2rem;
  width: 100%;

  a {
    display: flex;
    height: 2rem;
    margin: 0 1.5rem;
    width: 2rem;
  }

  b {
    color: #fff;
  }
}
</style>
