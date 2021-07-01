<template>
  <div
    class="search-input"
    :class="{ sided }"
  >
    <input
      ref="search"
      :value="value"
      type="text"
      :placeholder="placeholder"
      @input="search($event.target.value)"
    >
    <ButtonPlain
      v-if="value.length && !hideEraser"
      :title="$t('views.TipList.Clear')"
      @click="$emit('input', '')"
    >
      <IconEraser />
    </ButtonPlain>
    <IconSearch v-else-if="sided" />
    <ButtonPlain
      v-if="!sided"
      :title="$t('views.TipList.CloseSearch')"
      @click="$emit('close')"
    >
      <IconClose />
    </ButtonPlain>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import IconSearch from '../../assets/iconSearch.svg?icon-component';
import IconEraser from '../../assets/iconEraser.svg?icon-component';
import IconClose from '../../assets/iconClose.svg?icon-component';
import ButtonPlain from '../ButtonPlain.vue';

export default {
  components: {
    IconSearch,
    IconEraser,
    IconClose,
    ButtonPlain,
  },
  props: {
    sided: { type: Boolean },
    placeholder: { type: String, default: '' },
    value: { type: String, default: '' },
    hideEraser: Boolean,
    setFocused: Boolean,
  },
  mounted() {
    if (this.setFocused) { this.$refs.search.focus(); }
  },
  methods: {
    search: debounce(function set(value) {
      this.$emit('input', value);
    }, 300),
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  @include input-like;

  display: flex;
  align-items: center;

  &:focus-within .iconSearch {
    display: none;
  }

  input {
    flex-grow: 1;

    ~ * {
      margin-right: 10px;
    }
  }

  ::v-deep svg {
    height: 24px;
    opacity: 0.44;
    color: $standard_font_color;
    transition: opacity 0.3s;
    cursor: pointer;

    .background {
      opacity: 0;
      fill: $buttons_background;
    }

    &:hover {
      opacity: 1;

      .background {
        opacity: 1;
      }
    }
  }

  &.sided {
    height: 44px;

    input ~ * {
      margin-right: 20px;
    }
  }
}
</style>
