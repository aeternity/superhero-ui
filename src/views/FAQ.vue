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
        <expandable-block>
          <template slot="title">
            What is Superhero?
          </template>
          <template slot="body">
            Superhero is a P2P (Peer-to-Peer) platform for social sharing.<br>
            The mission of Superhero is to empowering people to support people,
            without intermediaries.<br>
            <router-link
              :to="{ name: 'mission' }"
              target="_blank"
            >
              Read our mission >
            </router-link>
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Who is Superhero?
          </template>
          <template slot="body">
            Superhero is an open-source project.<br>
            It is a tool for good built on
            <a
              href="https://aeternity.com/"
              target="_blank"
            >aeternity blockchain</a>.<br>
            Anyone, anywhere may use the platform.<br>
            Other websites may use the platform.<br>
            All have uncensored, equal ability to be Superhero.<br>
            As P2P – the only ones who are not part of Superhero intermediaries.<br>
            No 3<sup>rd</sup> party custodians will control
            content, or your ability to tip or receive tips.<br>
            Superhero is you and you and you and you… Without any “them” in-between.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            How does Superhero work?
          </template>
          <template slot="body">
            Superhero is built on aeternity blockchain.<br>
            Because it is built on blockchain, actions are transparent.<br>
            Because it is built on the blockchain, actions are published forever.<br>
            Blockchain has promised a more free and decentralized future for society.<br>
            Superhero used blockchain as its foundation to make that promise a reality.<br>
            Superhero is an online community making a tangible difference in the real world.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            How does tipping on Superhero work?
          </template>
          <template slot="body">
            The first Superpower launched on Superhero is a Wallet to tip any url.<br>
            You can get tips at your URL.<br>
            And you can send a tip to any URL you want.<br>
            ANY URL.<br>
            Yes, any URL you want - regardless of whether the
            URL owner has installed the wallet or not.<br>
            <br>
            All you need to give, collect, or claim tips in ae is a Superhero Wallet of your own.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            How do I get started on Superhero?
          </template>
          <template slot="body">
            We’ll walk you through it step by step
            <router-link
              :to="{ name: 'create-profile' }"
              target="_blank"
            >
              in our tutorial
            </router-link>
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            What does it cost? (How’s it free!?!)
          </template>
          <template slot="body">
            Superhero does not take any fees from its users to join.<br>
            Superhero does not take any commissions from tips.<br>
            Superhero is a non-profit, social impact project.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Where can I get tips with Superhero?
          </template>
          <template slot="body">
            Use Superhero alone to give / accept a tip of ae.<br>
            Used Superhero alongside other existing fiat-based
            tools to additionally give / accept a tip in ae.<br>
            <br>
            On Superhero’s platform, join a community posting,
            commenting, and tipping each other directly.<br>
            Off Superhero’s platform, add a Superhero button or
            link to your site so anyone can tip you directly.<br>
            On Superhero’s site and in the world wide web beyond Superhero’s site
            – build your support or give support without having any 3rd parties
            control your content or tips.<br>
            So long as a URL is live, it can be tipped.<br>
            And so long as you have access to your Superhero Wallet, your tips are yours.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Where can I send tips with Superhero? (Even URLs off Superhero?)
          </template>
          <template slot="body">
            Yes. ANY URL. Superhero will hold any tips sent a URL for one year.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Where does a tip go if there are more than one wallet to a URL?
          </template>
          <template slot="body">
            The first wallet address among the addresses on the page
            to claim the tip, gets the tip.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            When do I have to claim my tips?
          </template>
          <template slot="body">
            Tips must be claimed within one (1) year.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            What happens if a tip isn’t claimed?
          </template>
          <template slot="body">
            After one (1) year, unclaimed tips can be retrieved by the tip senders.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            What do I do to cash out?
          </template>
          <template slot="body">
            We got you on your way with all your tips. Check out Cashing Out in our tutorial.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            What about other wallets?
          </template>
          <template slot="body">
            So long as you have the private keys/seed phrase for the AE address,
            you can use it on Superhero through the Retrieve Account option at start-up.
            For some wallets, the seed phrase is not in the user’s custody.
            In this case, the AE address cannot be used for Superhero.<br>
            <br>
            You can simply Generate a New Wallet on Superhero and top it up
            by sending AE form your other wallets to your Superhero wallet address.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Can I use  an AE address from a centralized exchange for my Superhero wallet?
          </template>
          <template slot="body">
            No. For centralized exchanges, the exchange holds custody of users'
            private keys. This means that the user cannot use the AE address on
            Superhero because he/she does not have the private keys/seed phrase
            to retrieve the account.<br>
            <br>
            You can simply Generate a New Wallet on Superhero and top it up by
            sending AE form your other wallets to your Superhero wallet address.
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Can I edit my profile?
          </template>
          <template slot="body">
            Currently, users can only add short descriptions for their profile.
            But don’t despair—profile photos and avatars are coming soon!
          </template>
        </expandable-block>
        <expandable-block>
          <template slot="title">
            Can I get support? My question isn’t answered here…
          </template>
          <template slot="body">
            Need assistance? Report technical issue? Post feedback? Suggestion?  Get help.<br>
            People supporting people with answers in Superhero’s
            <a
              href="https://thesuperherowallet.typeform.com/to/cnbife"
              target="_blank"
            >
              &lt;Forum&gt;
            </a>
          </template>
        </expandable-block>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';

export default {
  name: 'FAQ',
  components: {
    LeftSection,
    RightSection,
    ExpandableBlock,
  },
};
</script>


<style lang="scss">
  .faq-page,
  .tutorial-page {
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
