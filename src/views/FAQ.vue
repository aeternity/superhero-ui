<template>
  <div>
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="content faq-page">
        <h1>Frequently Asked Questions</h1>
        <hr width="30%">
        <p>
          if you can't find the answer of you question below visit our
          <router-link
            to="/create-profile"
          >
            Tutorial Page
          </router-link>
          to<br> receive more information about using Superhero platform and wallet.
        </p>
        <expand-block
          :title="`1. What if there are 2 or more wallet addresses on
          the URL? Which one gets to receive the tip?`"
          :body="`The first wallet address among the addresses on
          the page to try to claim the tip gets it.`"
        />
        <expand-block
          :title="`2. Does Superhero earn commissions from my tips?`"
          :body="`No. Superhero is a non-profit, social impact project
          and does not take any commissions from tips.`"
        />
        <expand-block
          :title="`3. How do I edit my profile?`"
          :body="`Currently, users can only add short descriptions for their profile.
          But don’t despair—profile photos and avatars are coming soon!`"
        />
        <expand-block
          :title="`4. Do I have to add my wallet address to every Tweet?
          (if the tweet doesn’t show the address anymore?)`"
          :body="`As of now, the wallet cannot detect a wallet
          address in your profile if the tip was sent to a Tweet link
          — unless the Tweet itself contains the wallet address.`"
        />
        <expand-block
          :title="`5. If the owner of the URL I tipped doesn’t have an AE address on their site,
          will they still receive their tips?`"
          :body="`Yes, as soon as they create a Superhero wallet
          and add their wallet address to their URL,
          tips they’ve received in the past will be added into their wallet.`"
        />
        <expand-block
          :title="`6. I want to use my Base æpp wallet address
          for my Superhero wallet? Is this possible?`"
          :body="`Yes. You can choose Retrieve Existing Account
          and input the seed phrase for your Base æpp wallet.`"
        />
        <expand-block
          :title="`7. How long do I have to claim my tips?`"
          :body="`Tips must be claimed within one (1) year.`"
        />
        <expand-block
          :title="`8. What happens to tips that are never claimed?`"
          :body="`After one (1) year, the unclaimed tips can be retrieved by the tip senders.`"
        />
        <expand-block
          :title="questionNine"
          :body="answerNine"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandBlock from '../components/ExpandBlock.vue';

export default {
  name: 'FAQ',
  components: {
    LeftSection,
    RightSection,
    ExpandBlock,
  },
  data() {
    return {
      questionNine: `<span>
                      9. Where can I get support if 
                      I’m having problems with my Superhero wallet or the
                      Superhero.com
                      website?
                    </span>`,
      answerNine: `<p>
                    For assistance and to report issues regarding the Superhero wallet
                    or <a href="http://superhero.com" target="_blank">Superhero.com</a>,
                    you may post comments and questions
                    <a href="https://thesuperherowallet.typeform.com/to/cnbife" target="_blank">
                      here
                    </a>
                  </p>
                  <p>
                    Any suggestions and comments are also welcome. The feedback you give
                    will help make Superhero an even more awesome place.
                  </p>`,
    };
  },
};
</script>


<style lang="scss">
  .faq-page,
  .tutorial-page,
  .mission-page {
    background-color: $light_color;
    padding: 2rem;

    h1 {
      font-size: 1.5rem;
      color: $standard_font_color;
      margin-bottom: 1rem;
    }

    p {
      font-size: .8rem;
      color: $text_content_color;
    }

    h1,
    p {
      text-align: center;
    }
    a {
      color: $custom_links_color;

      &:hover {
        filter: saturate(0.5) brightness(1.2);
      }
    }
    hr {
      background: $search_nav_border_color;
      margin-bottom: 1rem;
    }
  }
</style>
