<template>
  <div
    class="create-token"
    :class="{ wait: loadingState }"
  >
    <div class="create-header">
      <div class="create-header-content">
        <h2>
          {{ success ?
            $t('components.CreateToken.NewToken') :
            $t('components.CreateToken.CreateToken') }}
        </h2>
        <h3>
          {{ success ?
            `Redirecting in ${seconds} seconds` :
            $t('components.CreateToken.FiveMinutes') }}
        </h3>
        <i18n
          :path="`components.CreateToken.StepsDescription[${step}]`"
          tag="p"
          class="step-description"
        >
          <template #abbreviation>
            <span class="abbreviation">{{ abbreviation }}</span>
          </template>
          <template #step>
            {{ $t(`components.CreateToken.Steps[${step}]`) }}
          </template>
        </i18n>
      </div>
      <div class="arrow-up" />
    </div>
    <div class="steps-wrapper">
      <div class="steps">
        <div
          v-for="(n,i) in 4"
          :key="i"
          class="step"
        >
          <div
            class="step-box"
            :class="{ active: step >= i, pulse: ((step === i) || step >= 4) }"
          />
        </div>
      </div>
      <div class="create-inputs input-group">
        <div class="input-block">
          <label for="name">{{ $t('components.CreateToken.TokenAsset') }}</label>
          <textarea
            v-if="!loadingState"
            id="name"
            v-model="name"
            placeholder="Enter any combination of characters *"
            class="form-control"
            :class="{ multiline: name.split('\n').length > 1 }"
            :rows="name.split('\n').length || 1"
            minlength="1"
            maxlength="333"
            :disabled="loadingState"
          />
          <p v-else>
            {{ name }}
          </p>
          <div
            v-if="!loadingState"
            class="input-info"
          >
            <span />
            <span>{{ `${name.length} / 333` }}</span>
          </div>
        </div>

        <div class="input-block">
          <label for="description">{{ $t('components.CreateToken.TokenDescription') }}</label>
          <textarea
            v-if="!loadingState"
            id="description"
            v-model="description"
            placeholder="Enter additional information about your token *"
            class="form-control"
            :class="{ multiline: description.split('\n').length > 1 }"
            :rows="description.split('\n').length || 1"
            minlength="1"
            maxlength="500"
            :disabled="loadingState"
          />
          <p
            v-else
            class="description"
          >
            {{ description }}
          </p>
          <div
            v-if="!loadingState"
            class="input-info"
          >
            <span />
            <span>{{ `${description.length} / 500` }}</span>
          </div>
        </div>
        <div class="input-block">
          <label for="abbreviation">
            {{ loadingState ?
              $t('components.CreateToken.Abbreviation') :
              $t('components.CreateToken.AbbreviationLong') }}
          </label>
          <div class="abbreviation">
            <div>
              <input
                v-if="!loadingState"
                id="abbreviation"
                v-model="abbreviation"
                placeholder="Enter token abbreviation *"
                class="form-control"
                minlength="1"
                maxlength="6"
                :disabled="loadingState"
              >
              <div
                v-else
                class="abbreviation"
              >
                {{ abbreviation }}
              </div>
              <div
                v-if="!loadingState"
                class="input-info"
              >
                <span />
                <span>{{ `${abbreviation.length} / 6` }}</span>
              </div>
            </div>
            <AeButton
              v-if="success"
              @click="navigateAssets"
            >
              <RightArrow />
              <span>
                {{ $t('components.CreateToken.Proceed') }}
              </span>
            </AeButton>
            <AeButton
              v-else
              :disabled="loadingState ||
                !name.length || !description.length || !abbreviation.length"
              @click="createWordSale"
            >
              <RightArrow />
              <span>
                {{ loadingState ?
                  $t('components.CreateToken.Proceed') :
                  $t('components.CreateToken.CreateToken') }}
              </span>
            </AeButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import AeButton from './AeButton.vue';
import RightArrow from '../assets/rightArrow.svg?icon-component';

export default {
  name: 'WordListing',
  components: {
    AeButton,
    RightArrow,
  },
  props: {
    word: { type: String, default: null },
    sale: { type: String, default: null },
    heading: { type: Boolean },
    navigateAssets: { type: Function, required: true },
  },
  data: () => ({
    name: '',
    description: '',
    abbreviation: '',
    loadingState: false,
    step: 0,
    success: false,
    seconds: 10,
  }),
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async createWordSale() {
      try {
        this.loadingState = true;
        const decimals = 18;
        const bondingCurveAddress = process.env.VUE_APP_BONDING_CURVE_18_DECIMALS_ADDRESS;
        const timeout = 20;

        this.step = 1;

        const tokenSaleAddress = await this.$store.dispatch('aeternity/deployTokenSaleContract',
          {
            decimals,
            timeout,
            bondingCurveAddress,
            description: this.description,
          });

        this.step = 2;
        const fungibleTokenAddress = await this.$store.dispatch('aeternity/deployFungibleTokenContract',
          {
            name: this.name,
            decimals,
            symbol: this.abbreviation,
            tokenSaleAddress,
          });

        this.step = 3;

        await Backend.addToken(fungibleTokenAddress);
        EventBus.$emit('reloadData');
        await Backend.invalidateWordRegistryCache();

        this.step = 4;
        EventBus.$emit('reloadData');

        this.success = true;
        this.countdown();
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: [
            this.$t('components.CreateToken.Error[0]', {
              index: this.step + 1,
              step: this.$t(`components.CreateToken.Steps[${this.step}]`),
            }),
            this.$t('components.CreateToken.Error[1]', { abbreviation: this.abbreviation }),
          ],
          hideIcon: true,
          primaryButtonText: 'OK',
        });
        this.name = '';
        this.description = '';
        this.abbreviation = '';
        this.loadingState = false;
        this.step = 0;
        this.success = false;
      }
    },
    countdown() {
      this.interval = setInterval(() => {
        this.seconds -= 1;
        if (this.seconds <= 0) {
          clearInterval(this.interval);
          this.navigateAssets();
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.create-token {
  background-color: $actions_ribbon_background_color;
  color: $light_font_color;
}

.create-header {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/createTokenBg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    mix-blend-mode: luminosity;
  }

  .create-header-content {
    padding-top: 1.2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-size: 1.6rem;
      font-weight: bold;
      color: $pure_white;
    }

    h3 {
      font-size: 1rem;
      font-weight: normal;
      color: $tip_note_color;
    }

    .step-description {
      font-size: 0.75rem;
      font-weight: 500;
      color: $pure_white;
      margin-top: 1rem;
    }
  }

  .arrow-up {
    position: absolute;
    bottom: 0;
    margin-left: -0.5rem;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid $card_border_color;
  }
}

.steps-wrapper {
  border: 1.5px solid $card_border_color;
  border-radius: 10px;
  margin: 0 16px;
  padding: 16px;

  .steps {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .step {
      flex-grow: 1;
      margin: 0 0.4rem;
      position: relative;

      .step-box {
        height: 0.8rem;
        background: $super_dark;
        border: 1px solid $super_dark;
        box-sizing: border-box;
        box-shadow: inset -0.1rem 0.15rem 0.3rem rgba(0, 0, 0, 0.25);
        border-radius: 0.3rem;

        &.active {
          background: $custom_links_color;
          box-shadow:
            inset 0 0 0.3rem 0.05rem
            rgba(
              red($custom_links_color),
              green($custom_links_color),
              blue($custom_links_color),
              0.4
            );

          &.pulse {
            animation: pulse 2s infinite ease-in-out;
          }

          @keyframes pulse {
            0%,
            100% {
              filter: opacity(0.4);
            }

            50% {
              filter: opacity(1);
            }
          }
        }
      }
    }
  }

  .create-inputs {
    display: flex;
    flex-direction: column;
    height: 100%;

    .input-block {
      margin-top: 32px;
    }

    label {
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
    }

    input,
    textarea {
      background: $buttons_background;
      resize: none;
      padding: 8px 16px;
      height: 40px;
      border: 1px solid transparent;
      transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;

      &.multiline {
        height: 100%;
      }

      &:focus {
        background-color: $actions_ribbon_background_color;
        border-color: $secondary_color;
      }
    }

    p {
      color: $standard_font_color;
      word-break: break-word;
      font-size: 15px;
      line-height: 24px;
      margin-top: 8px;
      margin-bottom: 0;

      &.description {
        color: $tip_note_color;
      }
    }

    .abbreviation {
      display: flex;
      justify-content: space-between;

      .abbreviation {
        font-size: 20px;
        line-height: 26px;
        margin-top: 11px;
      }

      input {
        width: 220px;

        @include mobile {
          width: 100%;
        }
      }

      @include mobile {
        flex-direction: column;
      }

      .ae-button {
        font-weight: 700;
        height: 40px;

        @include mobile {
          width: 100%;
        }

        svg {
          height: 1.2rem;
          border-radius: 100%;
          background-color: rgba(255, 255, 255, 0.44);
          padding: 0.2rem;
          margin-bottom: 0.1rem;
          margin-right: 3px;
        }
      }
    }
  }
}

.input-info {
  font-size: 12px;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.wait {
  cursor: wait;

  button,
  label {
    cursor: wait;
  }
}
</style>
