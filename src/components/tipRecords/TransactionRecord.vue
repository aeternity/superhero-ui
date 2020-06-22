<template>
  <div
    v-if="transactionTip"
    class="transaction-record"
  >
    <ThreeDotsMenu class="dots-menu">
      <div>
        <a>
          {{ $t('components.tipRecords.TransactionRecord.ViewTip') }}
        </a>
      </div>
      <div>
        <a>
          {{ $t('components.tipRecords.TransactionRecord.TraceTip') }}
        </a>
      </div>
    </ThreeDotsMenu>
    <div class="transaction-data">
      <div class="address text-ellipsis">
        <span>{{ transactionPrefix }}</span>
        {{ transactionTip.address }}
      </div>
    </div>
    <div class="transaction-preview">
      <a class="text-ellipsis link">
        <ExternalLink />
        <span>{{ transactionTip.link }}</span>
      </a>
      <img
        class="preview-image"
        src="../../assets/timeMachineCover.svg"
      >
    </div>
    <div class="actions">
      <TipInput
        :tip="transactionTip"
        class="tip-transaction"
      />
      <a class="view-tip">
        <img src="../../assets/viewTip.svg">
      </a>
      <div class="date">
        {{ transactionTip.date }}
      </div>
    </div>
  </div>
</template>

<script>
import TipInput from '../TipInput.vue';
import ThreeDotsMenu from '../ThreeDotsMenu.vue';
import ExternalLink from '../../assets/externalLink.svg?icon-component';

export default {
  name: 'TransactionRecord',
  components: {
    TipInput,
    ThreeDotsMenu,
    ExternalLink,
  },
  props: {
    transactionTip: { type: Object, default: null },
  },
  data() {
    return {
      transactionPrefix: 'Tx',
    };
  },
};
</script>

<style lang="scss" scoped>
.transaction-record {
  padding: 1rem;
  background-color: $light_color;
  color: $light_font_color;
  font-size: 0.65rem;
  font-weight: 400;
  position: relative;
  border-bottom: 0.15rem solid $background_color;
}

.dots-menu {
  position: absolute;
  top: 0.25rem;
  right: 0.75rem;
}

.transaction-data {
  line-height: 1rem;
  margin-bottom: 0.2rem;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 0.3rem;
    color: $tip_note_color;
  }

  .address {
    vertical-align: bottom;
  }
}

.tip-transaction {
  flex-grow: 1;

  &:hover {
    cursor: pointer;
  }
}

.transaction-preview {
  display: flex;
  margin-bottom: 0.2rem;
  align-items: center;

  svg {
    color: $tip_note_color;
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.3rem;
    vertical-align: sub;
  }

  .link {
    flex-grow: 1;
    line-height: 1.2rem;
  }
}

.actions {
  display: flex;
  align-items: center;
}

.view-tip {
  flex-grow: 1;
}

.date {
  flex-grow: 1;
  text-align: right;
}

.preview-image {
  width: 6.5rem;
  height: 3.3rem;
}

.link:hover,
.transaction-data:hover,
.view-tip:hover {
  filter: brightness(1.3);
  cursor: pointer;
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .transaction-data {
    font-size: 0.55rem;
  }
}
</style>
