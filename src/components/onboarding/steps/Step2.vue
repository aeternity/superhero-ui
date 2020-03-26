<template>
  <div class="step__content step_2">
    <div class="step__figure">
      <img
        src="../../../assets/step_2_Image.svg"
        alt=""
      >
    </div>
    <h1>Install Superhero Wallet</h1>
    <p>
      Superhero allows you to send tips to anyone with an online profile. Tip your favorite
      creators, musicians, and artists, as well as support good causes. Receive tips from your
      followers, raise funds for good causes, and send help where it’s needed.
    </p>
    <p>
      Fund transfers are instant, with near-zero processing fees.
      Censorship-proof: there are no third-party intermediaries to ban creators from sending and
      receiving payments, and records are immortalized on æternity blockchain. Learn more by our
      <router-link
        v-slot="{ href }"
        to="/create-profile"
      >
        <a
          :href="href"
          target="_blank"
        >Tutorial & FAQ</a>
      </router-link>
    </p>
    <p>
      <b>Install as browser extension and mobile app on your preferred platforms:</b>
    </p>
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
    margin: .5rem 0 2rem;
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
