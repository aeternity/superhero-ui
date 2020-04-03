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
      A Tool for Good Built on <a
        href="https://aeternity.com/"
        target="_blank"
      >aeternity Blockchain</a>
    </h1>
    <p>
      Superhero empowers <span class="highlited">people supporting people</span><br>
      including ability to transfer ae cryptocurrency P2P.<br>
      <span class="highlited">Send tips</span> directly
      to your fav creators, causes, projects...<br>
      <span class="highlited">Receive tips</span> directly from your fans.<br>
      <span class="highlited">Get or give help</span> any url on the web you please.<br>
      Learn more:
      <router-link
        v-slot="{ href }"
        to="/create-profile"
      >
        <a
          :href="href"
          target="_blank"
        >Tutorial </a>
      </router-link>
      &
      <router-link
        v-slot="{ href }"
        to="/faq"
      >
        <a
          :href="href"
          target="_blank"
        > FAQ</a>
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
</style>
