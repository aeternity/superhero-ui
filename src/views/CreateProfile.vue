<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper">
      <div class="content tutorial-page">
        <h1>
          HOW TO USE SUPERHERO.COM: <br>
          fully P2P tipping with no boundaries,<br>
          no censorship - at near-zero fees
        </h1>
        <hr width="30%">
        <expandable-block :title="'HOW TO USE SUPERHERO'">
          <p><b>Download and install the Superhero extension for your browser.</b></p>
          <p />
          <p>
            Superhero is currently available for Firefox and Chrome.<br>
            (The Chrome extension can be used for Brave and Opera.)
          </p>
          <p>
            For Firefox:<br>
            Get the add-on
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
              target="_blank"
            >
              here </a><br>
            Click
            <span class="highlited">Add</span>
            to Firefox. Confirm by clicking
            <span class="highlited">Add</span> again in the message prompt.<br>
            Then the Superhero icon should appear on the upper right corner of your Firefox browser
            toolbar.<br>
          </p>
          <p>
            For Chrome, Brave, and Opera:<br>
            Get the extension
            <a
              :href="chromeLink"
              target="_blank"
            > here </a><br>
            Add the extension to your browser.<br>
            Then the Superhero icon should appear on the upper right corner of your browser toolbar.
          </p>
        </expandable-block>
        <expandable-block :title="'CREATING YOUR WALLET'">
          <p>
            Tick the checkbox to agree to the terms and conditions.<br>
            Click <span class="highlited">CREATE A NEW WALLET.</span><br>
            That’s it—your wallet is created!<br>
            You can now start receiving tips from anyone through your wallet address.<br>
          </p>
          <p>
            You can find your wallet address on your dashboard, right above your balance.<br>
            It’s a random string of numbers and letters that starts with ak_.<br>
            This wallet address is also referred to as a public key— it’s what others see as your
            public ID by default.<br>
            You can easily copy this by clicking the copy button right next to your wallet address.
          </p>
        </expandable-block>
        <expandable-block :title="'SECURING YOUR WALLET'">
          <p>
            With great freedom comes great responsibility.<br>
            You’re in charge of keeping the keys to your account.<br>
            There are no third-party custodians to store nor connect any password with any
            account.<br>
            The task of keeping the keys to your wallet is yours and yours alone, Superhero.
          </p>
          <p>
            Here’s how to secure and backup your wallet:<br>
            Once you’re in your dashboard, you’ll get a series of words called a seed phrase.<br>
            The seed phrase is somewhat like a password – it’s a unique set of words (in order)
            which connects you to your wallet.<br>
          </p>
          <ul>
            <li>
              Click the <span class="highlited">hamburger menu</span>
              on the upper right of your wallet.
            </li>
            <li>
              Go to Settings, choose Seed Phrase.
            </li>
            <li>
              On the next screen, click Show seed phrase.
            </li>
          </ul>
          <p>
            You’ll need this seed phrase to retrieve your wallet in case you lose access to the
            extension for any reason (migrating to a new device, reinstalling browser, etc.)
          </p>
          <ul>
            <li>
              <b>Write down the 12 words displayed on a piece of paper and keep it in a safe and
                secret place.</b>
            </li>
          </ul>
          <p>
            Simple as that.
          </p>
        </expandable-block>
        <expandable-block :title="'SENDING TIPS'">
          <p>
            To send someone tips, make sure you are on the URL that you want to tip.<br>
            The Superhero wallet will automatically detect the URL on your active tab.
          </p>
          <ul>
            <li>
              Open your Superhero wallet extension. The button
              <img src="../assets/iconExtension.svg"> should be in the upper right of your browser
              toolbar.<br>
            </li>
            <li>Click <span class="highlited">Send Tip</span></li>
            <li>
              On the next screen, fill in the required fields. Enter the amount of tips you want to
              send, and add a message telling the receiver why they’re awesome.
            </li>
            <li>Click the <span class="highlited">Send Tip</span> button below.</li>
            <li>
              On the next screen, review the details of your tip.
            </li>
            <li>Click <span class="highlited">Confirm</span> to complete the transaction.</li>
          </ul>
        </expandable-block>
        <expandable-block :title="'RECEIVING TIPS'">
          <p>
            To receive tips yourself, copy your wallet address.
          </p>
          <p>
            Then paste your wallet address onto the web page or profile that was tipped—it could be
            a blog, a social media account, or any other online profile.<br>
            Save this change and refresh the page.
          </p>
          <p>
            You can also add your wallet address in the source code of your web page.<br>
            Once your wallet address is added to your web page, all you have to do is open your
            Superhero wallet… And voila— tips can be collected and added to your wallet balance.<br>
            In some cases, there may be slight delays in collecting tips.<br>
            Give it a few minutes and try opening your wallet again.<br>
            If the problem persists, you may ask questions through this
            <a
              href="https://thesuperherowallet.typeform.com/to/cnbife"
              target="_blank"
            >
              feedback form.
            </a>
          </p>
        </expandable-block>
        <expandable-block :title="'CASHING OUT'">
          <p>
            To withdraw tips received, you can send tips to your AE wallet address in a crypto
            exchange that supports AE tokens (see list above).
          </p>
          <ul>
            <li>Go to the hamburger menu. Click <span class="highlited">Withdraw.</span></li>
            <li>Enter your wallet address from the crypto exchange of your choice.</li>
            <li>Enter the amount you want to withdraw.</li>
            <li>Review the transaction details. Hit Send.</li>
          </ul>
          <p>
            Tips can then be converted into other cryptocurrencies or fiat and transferred to your
            local bank.<br>
            Processes for exchanges may vary per country.
          </p>
        </expandable-block>
        <expandable-block :title="'GETTING A .CHAIN NAME'">
          <p>
            You can claim a .chain name through the Superhero wallet extension.<br>
            A .chain name serves as an alternative to your wallet address, making it much easier for
            other users to send you a tip.<br>
            You can also use your .chain name as your profile name on Superhero.<br>
            To claim a name through your Superhero wallet:
          </p>
          <ul>
            <li>Open the <span class="highlited">hamburger menu</span> on the upper right.</li>
            <li>Click <span class="highlited">Names</span>.</li>
            <li>
              On the <span class="highlited">Add New</span>
              screen, type in your preferred name. Note that the suffix .chain is automatically
              appended to your name. This is mandatory in the naming system.
            </li>
            <li>Click the <span class="highlited">+</span> button to proceed.</li>
            <li>Click Confirm.</li>
          </ul>
          <p>
            Only numbers and letters are allowed in .chain names.<br>
            Names longer than 12 characters can be claimed by the first to initiate a claim
            transaction for that particular name.<br>
            Names 12 characters or shorter are subject to auction.<br>
            Shorter names are more expensive. Less characters mean longer auction times.<br>
            For more information on the naming system, click
            <a
              href="https://aeternity.com/documentation-hub/protocol/AENS/"
              target="_blank"
            >
              here </a>.
          </p>
          <p>
            You can claim as many names on Superhero as you want. But as a rule, you must have
            enough AE in your wallet to cover the initial price for the selected name.
          </p>
        </expandable-block>
        <expandable-block :title="'SUPERHERO PROFILE NAME'">
          <p>
            To set a .chain name as your Superhero profile name:
          </p>
          <ul>
            <li>
              Click the <span class="highlited">hamburger menu</span> and go to
              <span class="highlited">Names</span>.
            </li>
            <li>Click <span class="highlited">Your Names</span>.</li>
            <li>
              Under your preferred Superhero .chain name, click
              <span class="highlited">Set Name Pointer</span>.
            </li>
            <li>
              Paste the wallet address that you use on Superhero. Double check this wallet address
              to make sure you have the right one.
            </li>
            <li>
              Click <span class="highlited">Set Name Pointer</span>
              to confirm the action.
            </li>
          </ul>
        </expandable-block>
      </div>
    </div>
  </div>
</template>
<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'CreateProfile',
  components: {
    LeftSection,
    RightSection,
    ExpandableBlock,
    MobileNavigation,
  },
  computed: {
    chromeLink() {
      return 'https://chrome.google.com/webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne';
    },
  },
};
</script>

<style lang="scss">
.tutorial-page {
  color: $standard_font_color;

  .spacer {
    margin-bottom: 1rem;
  }

  .icons-margin {
    margin-right: 1rem;
  }

  .highlited {
    color: $standard_font_color;
    font-weight: 500;
  }
}
</style>
