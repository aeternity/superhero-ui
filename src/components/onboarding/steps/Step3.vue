<template>
  <div class="step__content step_3">
    <div class="step__figure">
      <img
        src="../../../assets/step_3_Image.svg"
        alt=""
      >
    </div>
    <h1>
      Receive Tips:<br>
      Making the Internet a Fairer Place
    </h1>
    <p>
      After your Superhero wallet is installed<br>
      <span class="important">1. Paste your wallet address</span> to your URL. <br>
      <span class="important">2. Load your URL</span> so your wallet can instantly collect.
    </p>
    <p class="highlited">
      People can directly support your content, cause project<br>
      (or you for simply being you) with no middleman.
    </p>

    <p class="highlited">
      To start, you'll need a wallet. It's free. It's easy.<br>
      <span class="important">
        Click a browser extensions or mobile app
      </span>
      <br>
      to install a Superhero wallet:
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
  name: 'Step3',
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
