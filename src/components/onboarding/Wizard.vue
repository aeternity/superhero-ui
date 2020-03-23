<template>
  <div class="onboarding" v-if="shouldShowWizard">
    <div class="onboarding__nav">
      <div class="onboarding__start" v-if="currentStep === null">
        <button
          @click="currentStep = 0"
          class="button"
          v-if="currentStep === null">
          Join Superhero League
        </button>
      </div>
      <div class="onboarding__tabs" v-else>
        <button
          :class="['onboarding_tab', { active: currentStep === index }]"
          :disabled="isStepDisabled(index)"
          :key="key"
          @click="currentStep = index"
          v-for="([key, tab], index) in steps"
        >
          {{ tab }}
        </button>
        <button
          @click="currentStep = null"
          class="onboarding__close"
        >
        </button>
      </div>
    </div>
    <div class="onboarding__body" v-if="currentStep !== null">
      <component :is="getStepComponent" @wizard:next="nextStep"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
      currentStep: this.retrieveStep(),
    };
  },
  computed: {
    shouldShowWizard() {
      return this.currentStep * 1 < steps.length;
    },
    getStepComponent() {
      if (this.currentStep in this.steps) {
        return this.steps[this.currentStep][0];
      }

      return null;
    },
    ...mapGetters(['account', 'isLoggedIn']),
  },
  watch: {
    currentStep(index) {
      this.storeStep(index);
    },
  },
  methods: {
    isStepDisabled(index) {
      return index > this.currentStep + 1;
    },
    nextStep() {
      if (this.currentStep < steps.length - 1) {
        this.currentStep += 1;
        return;
      }
      this.finalStep();
    },
    finalStep() {
      // set step after the last to hide permanently:
      // this.storeStep(steps.length);
      this.storeStep(null);

      if (this.account) {
        this.$router.push({
          name: 'user-profile',
          params: {
            address: this.account,
          },
        });
        return;
      }

      this.$router.push({ name: 'create-profile' });
    },
    storeStep(index) {
      if (index === null) {
        localStorage.removeItem('currentStep');

        return;
      }
      localStorage.setItem('currentStep', index);
    },
    retrieveStep() {
      if (localStorage.getItem('currentStep') === null) {
        return null;
      }

      return localStorage.getItem('currentStep') * 1;
    },
  },
};
</script>

<style lang="scss">
  .onboarding {
    border: 1px dashed $light_font_color;
    margin: .2rem 0 .1rem;

    button:active,
    button:focus {
      opacity: 0.9;
      outline: 0;
    }

    .button {
      background-color: inherit;
      border: 1px solid $custom_links_color;
      border-radius: .25rem;
      color: $custom_links_color;
      font-size: .75rem;
      font-weight: 700;
      justify-self: center;
      line-height: 1.125;
      padding: .65rem 2.5rem;

      &[disabled] {
        border: 1px solid #BBBBBE;
        color: #BBBBBE;
        opacity: .3;
      }
    }
  }

  .onboarding__container {
    margin-bottom: .15rem;
  }

  .onboarding__nav {
    background: $actions_ribbon_background_color;
    display: flex;
    justify-content: center;
    padding: 1rem 0 0;
  }

  .onboarding__start {
    padding-bottom: 1rem;

    .button {
      background: url("../../assets/wizardChevron.svg") no-repeat 1rem center;
      line-height: 1;
      padding: .65rem .9rem .65rem 2rem;
    }
  }

  .onboarding__tabs {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    width: 100%;

    // blank space to separate the close button
    &:after {
      content: ' ';
      flex-grow: 1;
      order: 99;
    }
  }

  .onboarding_tab {
    background: transparent;
    border: 0;
    border-bottom: 2px solid $custom_links_color;
    color: #52535a;
    font-size: 0.6rem;
    padding: 0 .5rem 1rem .5rem;
    position: relative;
    white-space: nowrap;

    &:first-child {
      padding-left: 1rem;
    }

    // superhero icon
    &:after {
      border-bottom: 2px solid #67b6f7;
      bottom: -2px;
      content: url("../../assets/activeTabIcon.svg");
      display: flex;
      height: 1rem;
      justify-content: flex-end;
      opacity: 0;
      position: absolute;
      right: calc(100% - 1.5rem);
      transition: right 0.5s;
      width: 0;
    }

    &.active {
      color: #fff;

      &:after {
        opacity: 1;
        right: -1.5rem;
      }

      & ~ .onboarding_tab {
        border-bottom: 2px solid transparent;
      }
    }
  }

  .onboarding__close {
    background: transparent;
    background: url("../../assets/wizardClose.svg") no-repeat center center;
    background-color: inherit;
    border: 0;
    color: #fff;
    font-size: 0.8rem;
    height: .9rem;
    justify-self: flex-end;
    margin-bottom: 1rem;
    margin-right: .75rem;
    order: 100;
    padding: 0;
    width: .9rem;
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

    h1 {
      color: #fff;
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    p {
      font-size: .8rem;
      line-height: 1.625;
      margin-bottom: 1rem;

      a {
        color: $custom_links_color;
      }
    }

    ol, ul {
      padding-left: 1rem;
      margin-bottom: 1rem;
    }

    li {
      font-size: .8rem;
      line-height: 1.75;
    }

    blockquote {
      color: #d2d2d4;
      font-size: 0.9rem;
      font-style: italic;
      font-weight: 700;
      line-height: 1.66;
      min-height: 4rem;
      padding: .5rem .5rem .5rem 2.5rem;
      position: relative;
      text-align: center;

      &:before {
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

        &:before,
        &:after {
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
    .onboarding_tab {
      padding: 0 .5rem 1rem 1rem;

      &:first-child {
        padding-left: 1.5rem;
      }
    }
  }

  @media (min-width: 992px) {
    .onboarding_tab {
      font-size: 0.8rem;
    }
  }
</style>
