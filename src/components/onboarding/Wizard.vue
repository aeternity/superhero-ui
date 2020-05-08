<template>
  <transition
    name="component-fade"
    appear
    mode="out-in"
  >
    <div
      v-if="shouldShowWizard"
      class="onboarding"
    >
      <transition
        name="component-fade"
        mode="out-in"
      >
        <div
          v-if="wizardIsCollapsed"
          :key="wizardIsCollapsed"
          class="onboarding__container collapsed"
        >
          <div class="onboarding__nav">
            <div class="onboarding__start">
              <button
                class="button"
                @click="setWizardIsCollapsed(false)"
              >
                {{ $t('components.onboarding.wizard.title') }}
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          :key="wizardIsCollapsed"
          class="onboarding__container"
        >
          <div class="onboarding__nav">
            <div class="onboarding__tabs">
              <button
                v-for="([key, tab], index) in steps"
                :key="key"
                :class="['onboarding_tab', { active: wizardCurrentStep === index }]"
                :disabled="isStepDisabled(index)"
                @click="setWizardCurrentStep(index)"
              >
                {{ tab }}
              </button>
              <button
                class="onboarding__close"
                @click="setWizardIsCollapsed(true)"
              />
            </div>
          </div>
          <div class="onboarding__body">
            <transition
              name="component-fade"
              mode="out-in"
            >
              <component
                :is="getStepComponent"
                @wizard:next="nextStep"
                @wizard:goto="gotoStep"
              />
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Step1 from './steps/Step1.vue';
import Step2 from './steps/Step2.vue';
import Step3 from './steps/Step3.vue';
import Step4 from './steps/Step4.vue';
import Step5 from './steps/Step5.vue';

const steps = [
  ['Step1', 'Mission'],
  ['Step2', 'Install Wallet'],
  ['Step3', 'Receive Tips'],
  ['Step4', 'Send Tips'],
  ['Step5', 'Your Profile'],
];

export default {
  name: 'Onboarding',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
  },
  data() {
    return {
      steps,
    };
  },
  computed: {
    ...mapGetters(['account', 'wizardCurrentStep', 'wizardIsCollapsed']),
    shouldShowWizard() {
      return this.wizardCurrentStep * 1 < steps.length;
    },
    getStepComponent() {
      if (this.wizardCurrentStep in this.steps) {
        return this.steps[this.wizardCurrentStep][0];
      }

      return null;
    },
  },
  methods: {
    ...mapActions(['setWizardCurrentStep', 'setWizardIsCollapsed']),
    isStepDisabled(index) {
      return index >= 0 && index > this.wizardCurrentStep + 1;
    },
    nextStep() {
      if (this.wizardCurrentStep < steps.length - 1) {
        this.setWizardCurrentStep(this.wizardCurrentStep + 1);
        return;
      }
      this.finalStep();
    },
    gotoStep(index) {
      if (this.isStepDisabled(index)) {
        return;
      }
      this.setWizardCurrentStep(index);
    },
    finalStep() {
      this.setWizardIsCollapsed(true);

      if (this.account && this.account.length) {
        // set step after the last to hide permanently (or until a new 'step' is added eventually):
        this.setWizardCurrentStep(steps.length);
        this.$router.push({
          name: 'user-profile',
          params: {
            address: this.account,
          },
        });
        return;
      }
      this.$router.push({ name: 'tutorial' });
    },
  },
};
</script>

<style lang="scss">
  .onboarding {
    position: relative;

    button:active,
    button:focus {
      opacity: 0.9;
      outline: 0;
    }

    .button {
      background-color: inherit;
      border: 1px solid $custom_links_color;
      border-radius: 0.25rem;
      color: $custom_links_color;
      font-size: 0.75rem;
      font-weight: 700;
      justify-self: center;
      line-height: 1.125;
      padding: 0.65rem 1rem;
      transition: filter 0.1s;

      &[disabled] {
        border: 1px solid #bbbbbe;
        color: #bbbbbe;
        opacity: 0.3;
      }

      &:hover:not([disabled]) {
        filter: saturate(0.5) brightness(1.2);
      }
    }
  }

  .onboarding__container {
    border: 1px dashed $light_font_color;
    margin: 0.2rem 0 0.15rem;

    &.collapsed {
      border: 0;
    }
  }

  .onboarding__nav {
    background: $actions_ribbon_background_color;
    display: flex;
    justify-content: center;
    padding: 0;
    position: relative;
    z-index: 1;
  }

  .onboarding__start {
    margin-top: 0.4rem;
    padding-bottom: 0.4rem;

    .button {
      background: url("../../assets/wizardChevron.svg") no-repeat 1rem center;
      line-height: 1;
      padding: 0.65rem 0.9rem 0.65rem 2.2rem;
    }
  }

  .onboarding__tabs {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    width: 100%;

    // blank space to separate the close button
    &::after {
      content: ' ';
      flex-grow: 1;
      order: 99;
    }
  }

  .onboarding_tab {
    background: transparent;
    border: 0;
    border-bottom: 2px solid $custom_links_color;
    color: $custom_links_color;
    font-size: 0.6rem;
    padding: 1rem 0.5rem;
    position: relative;
    white-space: nowrap;

    &:first-child {
      padding-left: 1rem;
    }

    // superhero icon
    &::after {
      border-bottom: 2px solid #67b6f7;
      bottom: -1rem;
      content: url("../../assets/activeTabIcon.svg");
      height: 2rem;
      justify-content: flex-end;
      position: absolute;
      left: 100%;
      transition: opacity 0.2s;
      opacity: 0;
      width: 0;
      margin-left: -1rem;
    }

    &.active {
      color: #fff;

      &::after {
        opacity: 1;
        left: 100%;
      }

      & ~ .onboarding_tab {
        border-bottom: 2px solid transparent;
        color: #52535a;
      }
    }

    &:hover:not(.active):not([disabled]) {
      filter: saturate(0.5) brightness(1.2);
    }
  }

  .onboarding__close {
    background: transparent;
    background: url("../../assets/wizardClose.svg") no-repeat center center;
    background-color: inherit;
    border: 0;
    color: #fff;
    font-size: 0.8rem;
    height: 0.9rem;
    justify-self: flex-end;
    margin: 1rem 0.75rem 1rem 0;
    order: 100;
    padding: 0;
    width: 0.9rem;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .onboarding__body {
    background-color: #21222c;
    padding: 1.5rem 2.5rem 2.25rem;
  }

  .step__content {
    color: #d2d2d4;

    .step__figure {
      margin-bottom: 1.35rem;
      text-align: center;

      img {
        height: 7.5rem;
        width: 7.5rem;
      }
    }

    .step__footer {
      display: flex;
      justify-content: center;
      margin-top: 2rem;

      .button {
        min-width: 11rem;
      }
    }

    .highlited {
      color: $standard_font_color;
      font-weight: 500;
    }

    a {
      color: $custom_links_color;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: $custom_links_color;
        filter: saturate(0.5) brightness(1.2);
      }
    }

    h1 {
      color: #fff;
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    p {
      font-size: 0.8rem;
      line-height: 1.625;
      margin-bottom: 1rem;
      text-align: center;

      a {
        color: $custom_links_color;
        text-decoration: underline;
      }
    }

    ol,
    ul {
      text-align: center;
      padding-left: 1rem;
      margin-bottom: 1rem;
    }

    li {
      font-size: 0.8rem;
      line-height: 1.75;
    }

    blockquote {
      color: #d2d2d4;
      font-size: 0.9rem;
      font-style: italic;
      font-weight: 700;
      line-height: 1.66;
      min-height: 4rem;
      padding: 0.5rem 0.5rem 0.5rem 2.5rem;
      position: relative;
      text-align: center;

      &::before {
        content: url("../../assets/quote.svg");
        height: 1.5rem;
        left: 0;
        position: absolute;
        top: 0.3rem;
      }

      cite {
        align-items: center;
        color: #d2d2d4;
        display: flex;
        font-size: 0.8rem;
        font-weight: 400;
        justify-content: center;
        left: -1.5rem;
        position: relative;

        &::before,
        &::after {
          border-bottom: 2px solid #4d4e56;
          content: '';
          height: 0;
          margin: 0 0.5rem;
          width: 1.25rem;
        }
      }
    }
  }

  @media (min-width: 992px) {
    .button {
      padding: 0.65rem 2.5rem;
    }

    .onboarding__start .button {
      padding: 0.65rem 0.9rem 0.65rem 2rem;
    }

    .onboarding_tab {
      font-size: 0.8rem;
      padding: 1rem 0.5rem 1rem 1rem;

      &:first-child {
        padding-left: 1.5rem;
      }
    }

    .step__content p a {
      text-decoration: none;
    }
  }

  // transition styles
  .component-fade-enter-active {
    transition: all 0.3s;
  }

  .component-fade-leave-active {
    transition: all 0.1s;
  }

  .component-fade-enter,
  .component-fade-leave-to {
    opacity: 0;
  }
</style>
