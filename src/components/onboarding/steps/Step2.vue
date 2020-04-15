<template>
  <div class="step__content step_2">
    <div class="step__figure">
      <img
        src="../../../assets/step_2_Image.svg"
        alt=""
      >
    </div>
    <h1>
      Install Superhero Wallet<br>
      A Tool for Good Built on
      <a
        href="https://aeternity.com/"
        target="_blank"
      >&aelig;ternity Blockchain</a>
    </h1>
    <p>
      Superhero empowers <span class="highlited">people supporting people,</span><br>
      including the ability to transfer AE cryptocurrency P2P.<br>
      <span class="highlited">Send tips </span>
      directly to your fav creators, causes, projects...<br>
      <span class="highlited">Receive tips</span> directly from your fans.<br>
      <span class="highlited">Get or give help</span> to any URL on the web as you please.<br>
    </p>
    <p class="highlited">
      To start, you'll need a wallet. It's free. It's easy.<br>
      <span class="important">
        Click a browser extension or a mobile app
      </span>
      <br>
      to install the Superhero wallet:
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
    <p>
      Learn more:
      <router-link
        v-slot="{ href }"
        to="/create-profile"
      >
        <a
          :href="href"
          target="_blank"
        >Tutorial</a>
      </router-link>
      &
      <router-link
        v-slot="{ href }"
        to="/faq"
      >
        <a
          :href="href"
          target="_blank"
        >FAQ</a>
      </router-link>
    </p>
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
