<template>
    <div class="step__content step_4">
      <div class="step__figure">
        <img src="../../../assets/step_4_Image.svg" alt="">
      </div>
      <h1>Send Tips To Other Awesome<br>
        Human Beings On The Web</h1>
      <p>
        Support charitable causes, fundraisers, quality content, musicians, artists,
        influencers—anything on the Internet. You can even tip other Superhero users for sharing
        content on <a href="https://superhero.com">Superhero.com</a>.
      </p>
      <ul>
        <li>Send tips to any URL</li>
        <li>Add a message along with that tip to let the recipient know why they’re awesome</li>
      </ul>
      <div class="step__footer">
        <button class="button" @click="nextStep()">Next</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Step4',
  methods: {
    nextStep() {
      this.$emit('wizard:next', this);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
