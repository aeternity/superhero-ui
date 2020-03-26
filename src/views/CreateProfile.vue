<template>
  <div>
    <right-section />
    <left-section />
    <div class="container wrapper">
      <div class="content tutorial-page">
        <h1>
          Join Superhero League: <br>
          fully P2P tipping with no boundaries,<br>
          no censorship - at near-zero fees
        </h1>
        <hr width="30%">
        <expand-block
          :title="`What is Superhero?`"
          :body="`<p>Superhero is a fully P2P wallet through which users can tip any URL.</p>
                    <p>
                      All transactions made through the Superhero
                      wallet are aggregated and published on ${superheroLink}
                    </p>
                    <p>
                      Superhero is an open-source project.
                      Other websites may use this for their own purposes.
                      With Superhero, there are no third-party custodians
                      to declare whether a content creator can be monetized or not.
                    </p>
                  `"
        />
        <expand-block
          :title="`What you can do with Superhero:`"
          :body="` <p>
                      <ul>
                        <li>
                          Send tips to URLs—regardless of whether the creator or author
                          has installed the wallet or not.
                        </li>
                        <li>
                          Receive tips from supporters—no censorship,
                          instant transactions at near-zero fees.
                        </li>
                        <li>
                          Read and interact with other other users by commenting
                          on posts through ${superheroLink}
                        </li>
                        <li>
                          Tip other Superhero users through
                          their posts and comments on ${superheroLink}
                        </li>
                        <li>
                          Build up your profile, reputation, and following on ${superheroLink}
                        </li>
                      </ul>
                    </p>`"
        />
        <expand-block
          :title="`What Superhero cannot do:`"
          :body="`<p>
                      The Superhero wallet uses a trustless system. Therefore,
                      there are no custodians to dictate what can and cannot be monetized.
                      So long as a URL is live, it can be tipped.
                      And so long as you have access to your Superhero account,
                      your tips are yours.
                    </p>`"
        />
        <expand-block
          :title="`How to use Superhero`"
          :body="`<p>Download and install the Superhero extension.</p>
                    <b>Superhero is available as:</b>
                    <p>- native mobile app for IOS and Android.</p>
                    <div class='spacer'>
                      <span class='icons-margin'>${appleStoreLink}</span>
                      <span>${androidStoreLink}</span>
                    </div>
                    <p>
                      - browser extension for Firefox and Chrome (the Chrome extension can be used
                      for Brave and Opera) Choose the right one for your browser.
                    </p>
                    <div class='spacer'>
                      <span class='icons-margin'>${firefoxLinkWithImage}</span>
                      <span>${chromeLinkWithImage}</span>
                    </div>
                    <div class='spacer'><b>For Firefox, get the add-on ${firefoxLink}</b></div>
                    <p>
                      Click
                      <span class='highlited'>Add to Firefox</span>,
                      and then confirm by clicking
                      <span class='highlited'>Add</span>
                       in the message
                      prompt.<br>
                      The Superhero icon should appear on the upper right corner of your Firefox
                      browser tool bar.
                    </p>
                    <p><b>For Chrome, Brave and Opera, get the add-on ${chromeLink}.</b></p>
                    <p>
                      Add the extension to your browser. The Superhero icon should appear on the
                      upper right corner of your Chrome browser tool bar.
                    </p>
                  `"
        />
        <expand-block
          :title="`Creating your wallet.`"
          :body="`<ul>
                      <li>
                        Tick the checkbox to agree to the terms and conditions.
                      </li>
                      <li>
                        Click CREATE A NEW WALLET.
                      </li>
                    </ul>
                    <p>
                      That’s it—your wallet is created!
                      You can now start receiving tips from anyone through your wallet address.
                    </p>

                    <p>
                      You can find your wallet address on your dashboard,
                      right above your balance.
                      It’s a random string of numbers and letters that starts with ak_.
                      This wallet address is also referred to as a public key—and is what
                      others see as your public ID by default.
                    </p>

                    <p>
                      You can easily copy this by clicking the copy
                      button  right next to your wallet address.
                    </p>
                    `"
        />
        <expand-block
          :title="`Backing up your seed phrase`"
          :body="`<p>
                      With great freedom comes great responsibility.
                      In this case, a little responsibility:
                      you are in charge of keeping the keys to your account,
                      and making sure you can retrieve it when necessary.
                    </p>

                    <p>
                      Security in the free web is a little different
                      from what most people are used to.
                      It’s much better—yet not really difficult.
                      Because there are no third party custodians to keep
                      and connect passwords with accounts,
                      this task is yours, Superhero.
                    </p>

                    <p>
                      Once you’re in your dashboard,
                      it is highly recommended that you back up your seed phrase.
                      The seed phrase is somewhat like a password.
                      You will need this seed phrase to retrieve your wallet in case you
                      lose access to the extension for any reason
                      (migrating to a new device, reinstalling browser, etc.).
                    </p>

                    <p>
                      Here’s how to do it:

                      <ul>
                        <li>
                          Click the hamburger menu on the upper right of your wallet.
                        </li>
                        <li>
                          Go to Settings, choose Seed Phrase.
                        </li>
                        <li>
                          On the next screen, click Show seed phrase.
                        </li>
                        <li>
                          Write down the 12 words displayed on a piece of paper
                          and keep this in a safe place that only you can find.
                        </li>
                      </ul>

                      Simple as that.

                    </p>`"
        />
        <expand-block
          :title="`Sending tips`"
          :body="` <ul>
                      <li>
                        To send someone tips, make sure you are on the URL that you want to tip.
                        The Superhero wallet will automatically detect the URL on your active tab.
                      </li>
                      <li>
                        Open your Superhero wallet extension.
                        The button should be in the upper right of your browser tool bar.
                      </li>
                      <li>
                        Click Tip someone.
                      </li>
                      <li>
                        On the next screen, fill in the required fields.
                        Enter the amount of tips you want to send,
                        and add a message telling the receiver why they’re awesome.
                      </li>
                      <li>
                        Click Send tip.
                      </li>
                      <li>
                        On the next screen, review the details of your tip.
                      </li>
                      <li>
                        Click Confirm to complete the transaction.
                      </li>
                    </ul>
                    `"
        />
        <expand-block
          :title="`Collecting your tips`"
          :body="`<ul>
                      <li>
                        To be able to receive tips,
                        you must first copy your wallet address and paste
                        it onto your web page or profile—it could be a blog,
                        a social media account, or any other online profile.
                      </li>
                      <li>
                        Save this change and refresh the page.
                        You can also add your wallet address in the source code of your web page.
                      </li>
                      <li>
                        Once your wallet address is added to your web page,
                        all you have to do is open your Superhero wallet
                        and voila—your tips will be collected and added to your wallet balance.
                      </li>
                    </ul>
                    <p>
                      In some cases, there may be slight delays in collecting tips.
                      Give it a few minutes and try opening your wallet again.
                      If the problem persists, you may ask questions through this Forum thread.
                    </p>`"
        />
        <expand-block
          :title="`What is Superhero?`"
          :body="`<p>
                      To load up your Superhero wallet,
                      you can trade ETH or BTC to AE through Jelly Swap.
                      You can also purchase AE tokens instantly using
                      your credit card through Changelly (fees for Changelly apply).
                      Just copy your Superhero wallet address
                      and paste it as the recipient address for your purchase.See below.
                    </p>
                    <p>
                      Additionally, here is a list of global exchanges that support AE tokens:
                      <ul>
                        <li>
                          Binance - the largest cryptocurrency exchange in the
                          world MXC Exchange - Chinese assets trading platform
                        </li>
                        <li>
                          Gate.io - Chinese assets trading platform
                        </li>
                        <li>
                          OKEx - Maltese cryptocurrency exchange
                        </li>
                        <li>
                          CoinAll - Maltese cryptocurrency exchange
                        </li>
                        <li>
                          DragonEx - Singaporean cryptocurrency exchange
                        </li>
                        <li>
                          HOTBIT - Chinese cryptocurrency exchange
                        </li>
                        <li>
                          HitBTC - American cryptocurrency exchange
                        </li>
                        <li>
                          CoinBene - Singaporean cryptocurrency exchange
                        </li>
                      </ul>
                    </p>`"
        />
        <expand-block
          :title="`Cashing out your earnings`"
          :body="`<p>
                      To withdraw the tips you’ve received,
                      you can send your tips to your AE wallet address in a crypto exchange
                      that supports AE tokens (see list above).
                      <ul>
                        <li>Go to the hamburger menu, click Withdraw.</li>
                        <li>Enter your wallet address from the crypto exchange of your choice as
                        well as the amount you want to withdraw.</li>
                        <li>Review the transaction details and hit Send once you are satisfied.</li>
                      </ul>
                    </p>
                    <p>
                      These can then be converted into other cryptocurrencies,
                      or converted into fiat and subsequently transferred to your local bank.
                      Methods for these vary per country.
                      Hopefully, in the future,
                      you will be able to cash out directly from AE into your bank.
                      Or even better, you may not even need to cash out at all in a world
                      where all merchants around you accept AE tokens. ;)
                    </p>`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandBlock from '../components/ExpandBlock.vue';
import imageAppleStore from '../assets/imageAppleStore.svg';
import imageGooglePlay from '../assets/imageGooglePlay.svg';
import imageFirefoxBrowser from '../assets/imageFirefoxBrowser.svg';
import imageChromeBrowser from '../assets/imageChromeBrowser.svg';

export default {
  name: 'CreateProfile',
  components: {
    LeftSection,
    RightSection,
    ExpandBlock,
  },
  computed: {
    superheroLink() {
      return '<a href="http://superhero.com" target="_blank">Superhero.com</a>';
    },
    androidStoreLink() {
      return `<a
                href="https://play.google.com/store/apps/details?id=com.superhero.cordova"
                target="_blank">
                <img src="${imageGooglePlay}">
              </a>`;
    },
    appleStoreLink() {
      return `<a
              href="https://apps.apple.com/bg/app/superhero-wallet/id1502786641"
              target="_blank">
              <img src="${imageAppleStore}">
            </a>`;
    },
    chromeLinkWithImage() {
      return `<a
                href="https://chrome.google.com
                /webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne"
                target="_blank">
                <img src="${imageChromeBrowser}">
              </a>`;
    },
    chromeLink() {
      return `<a
                href="https://chrome.google.com
                /webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne"
                target="_blank">
                here
              </a>`;
    },
    firefoxLinkWithImage() {
      return `<a
                href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
                target="_blank">
                <img src="${imageFirefoxBrowser}">
              </a>`;
    },
    firefoxLink() {
      return `<a
                href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
                target="_blank">
                here
              </a>`;
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
