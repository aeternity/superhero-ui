<template>
  <div class="get-ae">
    <div
      class="card"
      @click="goTo('https://jelly.market/')"
    >
      <LogoJellySwap />
      <i18n
        path="components.GetAe.Platforms.Jelly"
        tag="p"
      >
        <template #ae>
          <span class="abbreviation">AE</span>
        </template>
      </i18n>
    </div>
    <div
      class="card"
      @click="goTo('https://coinmarketcap.com/en/currencies/aeternity/')"
    >
      <LogoCoinMarketCap />
      <i18n
        path="components.GetAe.Platforms.CoinMarketCap"
        tag="p"
      >
        <template #ae>
          <span class="abbreviation">AE</span>
        </template>
      </i18n>
    </div>
    <div
      class="card"
      @click="goTo('https://faucet.aepps.com/')"
    >
      <LogoFaucet />
      <i18n
        path="components.GetAe.Platforms.Faucet"
        tag="p"
      >
        <template #ae>
          <span class="abbreviation">AE</span>
        </template>
      </i18n>
    </div>
  </div>
</template>

<script>
import LogoJellySwap from '../assets/logoJellySwap.svg?icon-component';
import LogoCoinMarketCap from '../assets/logoCoinMarketCap.svg?icon-component';
import LogoFaucet from '../assets/logoFaucet.svg?icon-component';

export default {
  components: {
    LogoJellySwap,
    LogoCoinMarketCap,
    LogoFaucet,
  },
  methods: {
    goTo(link) { window.open(link); },
  },
  metaInfo() {
    return { title: this.$t('views.WordBazaar.RibbonTabs.Get.Text') };
  },
};
</script>

<style lang="scss" scoped>
.get-ae {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 36px 0;
  background-color: $actions_ribbon_background_color;

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 176px;
    height: 128px;
    padding: 16px 24px;
    margin: 12px;
    background: $super_dark;
    border: 0;
    border-radius: 6px;
    box-shadow: 4px 4px 10px rgba($background_color, 0.25);
    transition: background-color 0.3s;

    &:hover {
      background-color: $buttons_background;
      cursor: pointer;
    }

    svg {
      max-width: 128px;
      max-height: 48px;
      margin: 0 auto;
    }

    p {
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
      text-align: center;
      margin: 4px 8px;
      color: $light_font_color;
    }
  }
}
</style>
