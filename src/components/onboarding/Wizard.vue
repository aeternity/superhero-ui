<template>
  <div class="onboarding">
    <div class="onboarding__nav">
      <div class="onboarding__start_wrapper" v-if="currentStep === null">
        <button
          @click="currentStep = 0"
          class="onboarding__start"
          v-if="currentStep === null">
          Join Superhero League
        </button>
      </div>
      <div class="onboarding__tabs" v-else>
        <button
          :class="['onboarding_tab', { active: currentStep === index }]"
          :_disabled="index > currentStep + 1 || index < currentStep - 1"
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
    <div class="onboarding__body">
      <div class="onboarding__content">
        <component :is="getStepComponent"/>
      </div>
    </div>
  </div>
</template>

<script>
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
    getStepComponent() {
      if (this.currentStep in this.steps) {
        return this.steps[this.currentStep][0];
      }

      return null;
    },
  },
  watch: {
    currentStep(step) {
      this.storeStep(step);
    },
  },
  methods: {
    storeStep(step) {
      if (step === null) {
        localStorage.removeItem('currentStep');

        return;
      }
      localStorage.setItem('currentStep', step);
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
    button:active,
    button:focus {
      opacity: 0.9;
      outline: 0;
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

  .onboarding__tabs {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    align-items: center;

    // blank space to separate the close button
    &:after {
      order: 99;
      flex-grow: 1;
      content: ' ';
    }
  }

  .onboarding_tab {
    background: transparent;
    border: 0;
    color: #52535a;
    font-size: 0.8rem;
    padding: 0 0 1rem 1.5rem;
    border-bottom: 2px solid $custom_links_color;

    &.active {
      color: #fff;
      & ~ .onboarding_tab {
        border-bottom: 2px solid transparent;
      }
    }
  }
  .onboarding__close {
    background: transparent;
    border: 0;
    color: #fff;
    font-size: 0.8rem;
    padding: 0;
    background: url("../../assets/wizardClose.svg") no-repeat center center;
    background-color: inherit;
    width: .9rem;
    height: .9rem;
    justify-self: flex-end;
    order: 100;
    margin-bottom: 1rem;
    margin-right: .75rem;
  }

  .onboarding__start {
    background: url("../../assets/wizardChevron.svg") no-repeat 1rem center;
    background-color: inherit;
    border: 1px solid $custom_links_color;
    border-radius: .25rem;
    color: $custom_links_color;
    font-size: .75rem;
    font-weight: 700;
    justify-self: center;
    line-height: 1;
    padding: .65rem .9rem .65rem 2rem;
  }
</style>
