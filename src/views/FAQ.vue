<template>
  <div>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper mt-2">
      <div class="content">
        <h2>FAQ</h2>
        <p class="question">
          1. What if there are 2 or more wallet addresses on the URL?
          Which one gets to receive the tip?
        </p>
        <p>The first wallet address among the addresses on
          the page to try to claim the tip gets it.</p>
        <p class="question">
          2. Does Superhero earn commissions from my tips?
        </p>
        <p>No. Superhero is a non-profit, social impact project
          and does not take any commissions from tips.</p>
        <p class="question">3. How do I edit my profile?</p>
        <p>
          Currently, users can only add short descriptions for their profile.
          But don’t despair—profile photos and avatars are coming soon!
        </p>
        <p class="question">
          4. Do I have to add my wallet address to every Tweet?
          (if the tweet doesn’t show the address anymore?)
        </p>
        <p class="question">
          5. If the owner of the URL I tipped doesn’t have an AE address on their site,
          will they still receive their tips?
        </p>
        <p>
          Yes, as soon as they create a Superhero wallet
          and add their wallet address to their URL,
          tips they’ve received in the past will be added into their wallet.
        </p>
        <p class="question">
          6. I want to use my Base æpp wallet address for my Superhero wallet? Is this possible?
        </p>
        <p>
          Yes. You can choose Retrieve Existing Account
          and input the seed phrase for your Base æpp wallet.
        </p>
        <p class="question">
          7. How long do I have to claim my tips?
        </p>
        <p>
          Tips must be claimed within one (1) year.
        </p>
        <p class="question">
          8. What happens to tips that are never claimed?
        </p>
        <p>
          After one (1) year, the unclaimed tips can be retrieved by the tip senders.
        </p>
        <p class="question">
         9. Where can I get support if I’m having problems with my Superhero wallet or the
          <a href="http://superhero.com" target="_blank">Superhero.com</a> website?
        </p>
        <p>For assistance and to report issues regarding the Superhero wallet
          or <a href="http://superhero.com" target="_blank">Superhero.com</a>,
          you may post comments and questions on
          <a href="https://forum.aeternity.com/" target="_blank">https://forum.aeternity.com/</a>
        </p>
        <p>
          Any suggestions and comments are also welcome. The feedback you give
          will help make Superhero an even more awesome place.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';

export default {
  name: 'FAQ',
  components: {
    LeftSection,
    RightSection,
  },
};
</script>


<style lang="scss" scoped>
  .content {
    color: $standard_font_color;
  }
  .question {
    font-size: 1rem;
    font-weight: 600;
  }
  a{
    color: $custom_links_color;
  }
  p {
    font-size: .8rem;
  }
</style>
