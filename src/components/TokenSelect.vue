<template>
  <Menu
    class="token-select"
    @close="resolve"
  >
    <Component
      :is="notSelectable ? 'div' : 'ButtonPlain'"
      v-for="token in tokens"
      :key="token.token"
      @click="resolve(token)"
    >
      <TokenAvatarAndSymbol :address="token.token" />
      <span class="amount">
        <!-- TODO: rename `balance` to `amount` -->
        {{ roundedTokenAmount(token.amount || token.balance, token.token) }}
      </span>
      &nbsp;<FiatValue
        :amount="token.amount || token.balance"
        :token="token.token"
        :aettos="!!token.token"
      />
    </Component>
  </Menu>
</template>

<script>
import { createPopper } from '@popperjs/core';
import { mapState, mapGetters } from 'vuex';
import Menu from './Menu.vue';
import ButtonPlain from './ButtonPlain.vue';
import TokenAvatarAndSymbol from './fungibleTokens/TokenAvatarAndSymbol.vue';
import FiatValue from './FiatValue.vue';

export default {
  components: {
    Menu,
    ButtonPlain,
    TokenAvatarAndSymbol,
    FiatValue,
  },
  props: {
    resolve: { type: Function, required: true },
    reference: { type: Element, required: true },
    tokens: { type: Array, required: true },
    notSelectable: Boolean,
    inEnd: Boolean,
  },
  computed: {
    ...mapGetters(['roundedTokenAmount']),
    ...mapState(['address', 'tokenInfo']),
    ...mapState('aeternity', ['useSdkWallet']),
    ...mapGetters('backend', ['minTipAmount']),
  },
  async mounted() {
    const p = this.inEnd ? 'end' : 'start';
    const popper = createPopper(this.reference, this.$el.querySelector('.modal-content'), {
      placement: `bottom-${p}`,
      modifiers: [{
        name: 'flip',
        options: { fallbackPlacements: [`top-${p}`] },
      }],
    });
    this.$on('hook:destroy', popper.destroy);
  },
};
</script>

<style lang="scss" scoped>
.token-select.menu .modal-content > {
  div,
  .button-plain {
    display: flex;
    align-items: center;
    min-width: 12rem;
    max-width: 15rem;

    .token-avatar-and-symbol {
      flex-grow: 1;
    }

    .amount {
      color: $tip-note-color;
      flex-shrink: 0;
    }
  }
}
</style>
