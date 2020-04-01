<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="content mission-page">
        <h1>SUPERHERO: AN ORIGIN STORY WITH A MISSION</h1>
        <hr width="30%">
        <p>
          In comics, Superheroes believe it’s their duty to help good triumph.<br>
          Meanwhile - very real, modern times continually test humanity.
        </p>
        <p>
          From artists to scientists, educators, medical groups,
          non-profit projects, social impact initiatives, community
          causes, animal welfare, environmental advocacy to the one inspiring you…<br>
          We can (and do) make a difference every day to each other.<br>
          People supporting people are contemporary Superheroes.<br>
        </p>
        <p>
          Superhero.com was conceived as a tangible way to
          celebrate the difference that can come from empowering
          people to support people, P2P, without intermediaries.
        </p>
        <p>
          Superhero.com was built as an open source platform
          which shifts the control of people supporting people
          away from private entities back into public hands.
        </p>
        <p>
          Those at <span class="highlited">æternity blockchain</span> that brought Superhero.com
          to life are united in helping deliver on the promise of a better internet for all.
        </p>
        <p>
          Welcome to a better virtual world – an internet
          with quantifiably more freedom to transact.<br>
          We only have just begun to see where our superpowers
          of being humans that support each other can take us.
        </p>
        <h1>ARE YOU MAKING A DIFFERENCE?</h1>
        <p>
          <b>Superhero.com</b><br>
          a tool for good built on
          <span class="highlited">æternity blockchain</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'FAQ',
  components: {
    LeftSection,
    RightSection,
    MobileNavigation,
  },
};
</script>


<style lang="scss">
  .mission-page {
    background-image: url('../assets/Mission.jpg');
  }
</style>
