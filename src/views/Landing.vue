<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="landing-page-container">
    <header
      id="header"
      class="sh-header"
    >
      <div class="sh-container-fluid">
        <nav class="main-navbar">
          <div class="header-logo">
            <RouterLink :to="{ name: 'feed' }">
              <img
                alt="Logo"
                src="../assets/landing/logo.svg"
              >
            </RouterLink>
            <button class="toggle">
              <i class="fas fa-bars" />
            </button>
          </div>
          <div class="sh-navbar">
            <ul class="links">
              <li>
                <a
                  href="https://github.com/aeternity/superhero-ui/"
                  target="_blank"
                >{{ $t('views.Landing.topNavigation.Contribute') }}</a>
              </li>
              <li class="join">
                <RouterLink
                  :to="{ name: 'feed' }"
                  class="sh-btn-blue"
                >
                  {{ $t('views.Landing.topNavigation.GetStarted') }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header><!-- /header -->
    <main
      id="main"
      class="landing-page-container"
    >
      <section class="main-banner">
        <div
          id="about"
          class="banner-caption"
        >
          <div class="sh-container">
            <h3>REALIZE THE POWER YOU WIELD</h3>
            <h1>
              Superhero is your cutting-edge, <b>decentralized</b>, social network
            </h1>
            <p>
              Get full control of your data back into your hands - no interference, no data abuse,
              and no censorship EVER.
            </p>
            <RouterLink
              :to="{ name: 'feed' }"
              class="sh-btn-blue"
            >
              {{ $t('views.Landing.section1.linkFeed') }}
            </RouterLink>
            <div class="banner-img">
              <VueAos animation-class="animate__animated animate__fadeInUp">
                <img
                  alt=""
                  src="../assets/landing/banner-img.png"
                >
              </VueAos>
            </div>
          </div>
        </div>
      </section>
      <section class="superhero-story">
        <div class="sh-container">
          <div class="sh-row">
            <div class="sh-col-6 left-share">
              <div class="share-history">
                <div class="top-title">
                  <VueAos animation-class="animate__animated animate__delay-1s animate__zoomIn">
                    <span>Privacy First</span>
                  </VueAos>
                  <h2>Share your story — </h2>
                  <p>not your data</p>
                </div>
              </div>
            </div>
            <div class="sh-col-6 right-share-text">
              <VueAos animation-class="animate__animated animate__delay-2s animate__fadeIn">
                <p>
                  Anchored on the powerful, open-source æternity blockchain, Superhero is defined by
                  the user’s basic right to be fully in control of their online identity, data, and
                  personal information.
                </p>
              </VueAos>
            </div>
          </div>
          <VueAos animation-class="animate__animated animate__fadeIn">
            <div class="sh-row">
              <div class="sh-col-3 left-voting-box">
                <div class="inner-left-voting-box">
                  <img
                    alt=""
                    src="../assets/landing/voting.svg"
                  >
                  <h4>
                    Fully decentralized
                  </h4>
                  <p>
                    Superhero is decentralized. This means that no third party involvement will ever
                    be permitted within the Superhero platform. All interactions are between the
                    users themselves. This implies that there is no entity controlling the
                    activities or pushing content on users.
                  </p>
                </div>
              </div>
              <div class="sh-col-9 voting-img">
                <img
                  alt=""
                  src="../assets/landing/post.png"
                >
              </div>
            </div>
          </VueAos>
          <div
            v-if="stats"
            class="sh-row"
          >
            <VueAos animation-class="animate__animated animate__delay-1s animate__fadeInUp">
              <div class="sh-col-3 sm-text-box">
                <h4>{{ stats.total_tips_length }}</h4>
                <p>Tips aggregated</p>
              </div>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-2s animate__fadeInUp">
              <div class="sh-col-3 sm-text-box">
                <h4>
                  <AeAmount :amount="stats.total_amount_ae" />
                </h4>
                <p>Total Tips Value</p>
              </div>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-3s animate__fadeInUp">
              <div class="sh-col-3 sm-text-box">
                <h4>
                  <AeAmount :amount="stats.total_claimed_amount_ae" />
                </h4>
                <p>Total Tips Claimed</p>
              </div>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-4s animate__fadeInUp">
              <div class="sh-col-3 sm-text-box">
                <h4>{{ stats.senders_length }}</h4>
                <p>Unique Tip Senders</p>
              </div>
            </VueAos>
          </div>
        </div>
      </section>
      <section class="superhero-tips">
        <div class="sh-container">
          <VueAos animation-class="animate__animated animate__fadeInUp">
            <div class="sh-row">
              <div class="sh-col-6 left-tips">
                <div class="top-title">
                  <VueAos animation-class="animate__animated animate__delay-1s animate__zoomIn">
                    <h4>TIPPING</h4>
                  </VueAos>
                  <p><b>Sending crypto</b> has never been <b>easier</b></p>
                </div>
                <div class="desc">
                  <p>
                    Superhero’s native wallet application, compatible with most platforms and
                    browsers, seamlessly integrates into your daily life and allows you to send
                    crypto instantaneously - at virtually no cost! There is no fee, except a small
                    compensation for miners that keep the network running safely. <br>A true
                    peer-to-peer platform, Superhero has no intermediaries and allows for no
                    third-party interference, by design.
                  </p>
                  <p>
                    Superhero wallet isn’t just an ordinary cryptocurrency wallet.<br> Through the
                    Superhero wallet each user can create
                    invitation links, follow transaction history or claim tips they have received
                    through the Superhero tipping option, and much more.
                  </p>
                  <div class="desc-hero">
                    <a
                      href="https://apps.apple.com/app/superhero-wallet/id1502786641"
                      target="_blank"
                    ><img
                      alt=""
                      src="../assets/landing/appstore.svg"
                    ></a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.superhero.cordova"
                      target="_blank"
                    ><img
                      alt=""
                      src="../assets/landing/googleplay.svg"
                    ></a>
                  </div>
                </div>
              </div>
              <div class="sh-col-6 left-tips-img">
                <VueAos animation-class="animate__animated animate__delay-4s animate__fadeIn">
                  <img
                    alt=""
                    src="../assets/landing/mockup.png"
                  >
                </VueAos>
              </div>
            </div>
          </VueAos>
        </div>
      </section>
      <section class="superhero-tokenization">
        <div class="sh-container">
          <div class="top-title">
            <VueAos animation-class="animate__animated animate__delay-1s animate__zoomIn">
              <span>CENTRALIZED SOCIAL MEDIA VS SUPERHERO</span>
            </VueAos>
            <h2>
              Centralized social media platforms have made their <b>profits</b> on extracting
              <b>data</b> from
              their users and selling it to companies, which use this information for targeted
              advertising and pushing agendas in their interest.
            </h2>
          </div>
          <ul class="custom-list">
            <VueAos animation-class="animate__animated animate__delay-1s animate__fadeInRight">
              <li>
                Superhero will never track you
              </li>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-2s animate__fadeInRight">
              <li>Superhero will never sell your data</li>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-3s animate__fadeInRight">
              <li>Superhero will never cooperate with intelligence agencies</li>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-4s animate__fadeInRight">
              <li>Superhero is 100% open source</li>
            </VueAos>
          </ul>
        </div>
      </section>
      <section class="superhero-crypto">
        <div class="sh-container">
          <div class="custom-title">
            <h2>Full of <b>powerful features</b></h2>
            <p>
              Superhero is among the first, if not the only, platform which has implemented the
              tipping method and applied its qualitative and quantitative measure to content
              spreading. This system enables users to simultaneously show appreciation to content
              creators, by sending them a token of gratitude for their effort, while at the same
              time, helping spread this content further, to other users, thus additionally
              supporting the information they value.
            </p>
          </div>
          <div class="sh-row">
            <VueAos animation-class="animate__animated animate__delay-1s animate__fadeInUp">
              <div class="sh-col-4 crypto-box">
                <img
                  alt=""
                  src="../assets/landing/superhero-meet-icon.png"
                >
                <h4>Superhero Meet</h4>
                <p>
                  Superhero Meet is using superpowers to bring you and your friends or collaborators
                  closer together! Set up a conference room easily and quickly – no account or
                  personal details needed – and gather up with fellow Superheroes to launch
                  missions, work on projects, and add value to the world! With an option to
                  live-stream a Meet Session on YouTube, Superhero Meet allows real-time
                  decentralized tipping as well!
                </p>
              </div>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-2s animate__fadeInUp">
              <div class="sh-col-4 crypto-box">
                <img
                  alt=""
                  src="../assets/landing/superhero-voting-icon.png"
                >
                <h4>Superhero Voting</h4>
                <p>
                  All Superhero community members can – and are invited to – vote and have their
                  voices heard by others. The Superhero governance æpp enables everybody to create
                  polls on any topic or issue, vote, delegate votes to other members, or collect
                  voting power from the Superhero community. Every vote is important and every vote
                  counts – especially as important decisions approach!
                </p>
              </div>
            </VueAos>
            <VueAos animation-class="animate__animated animate__delay-3s animate__fadeInUp">
              <div class="sh-col-4 crypto-box">
                <img
                  alt=""
                  src="../assets/landing/superhero-league-icon.png"
                >
                <h4>Superhero Button</h4>
                <p>
                  If you run a website or a blog, you can collect Superhero tips with a simple,
                  customizable, easy-to-integrate Tip button. The Superhero Tip button size, shape,
                  and look can be customized so it seamlessly integrates with your blog or website –
                  looking like it’s always been there. Add the Superhero button and let people
                  reward your work – today!
                </p>
                <a
                  class="sh-btn-blue"
                  href="https://github.com/aeternity/superhero-utils"
                  target="_blank"
                >Learn More</a>
              </div>
            </VueAos>
          </div>
        </div>
      </section>
      <section class="superhero-sendTrips">
        <div class="sh-container">
          <div class="sh-row">
            <div class="sh-col-6 empty-div" />
            <div class="sh-col-6 left-tips">
              <div class="top-title">
                <span>OPEN SOURCE</span>
                <h2>Superhero</h2>
                <p>is open-source</p>
              </div>
              <div class="desc">
                <p>
                  Superhero is completely open-source, meaning that anybody is free – and, indeed,
                  invited – to take a peek under the hood and use the source code, fork it, or run
                  and operate it locally. Superhero relies on its community to ensure utmost
                  security while developing cool new features and moving the ecosystem forward. Join
                  the global collaborative platform today and be a part of the change!
                </p>
                <a
                  class="sh-btn-blue"
                  href="https://github.com/aeternity/superhero-ui/"
                  target="_blank"
                ><img
                  alt=""
                  src="../assets/landing/github.svg"
                > Contribute on
                  Github</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="superhero-cta button-left-section">
        <img
          alt=""
          src="../assets/landing/superhero-cta.svg"
        >
        <div class="sh-join">
          <RouterLink
            :to="{ name: 'feed' }"
            class="sh-btn-blue"
          >
            {{ $t('views.Landing.section1.linkFeed') }}
          </RouterLink>
        </div>
      </section>
      <section class="superhero-footer">
        <div class="sh-container bottom-footer top">
          <div class="sh-row">
            <div class="sh-col-6 left-foot">
              <p>
                Superhero is the world’s first decentralized, open-source social media
                platform.
              </p>
            </div>
            <div class="sh-col-6 right-subscribe">
              <form class="subscribe-form">
                <div class="form-group">
                  <input
                    class="form-control"
                    name=""
                    placeholder="Get started"
                    type="text"
                  >
                  <button class="subscribe-button">
                    Subscribe now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="sh-container bottom-footer">
          <div class="sh-row">
            <div class="sh-col-4 left-sh-foot">
              <a href=""><img
                alt=""
                src="../assets/landing/superhero-logo-black.svg"
              ></a>
            </div>
            <div class="sh-col-4 center-sh-foot">
              <p>{{ $t('views.Landing.footer.Copyright') }}</p>
            </div>
            <div class="sh-col-4 right-sh-foot">
              <a
                href="https://t.me/superherocom"
                target="_blank"
              >Telegram</a>
              <a
                href="https://twitter.com/superhero_chain"
                target="_blank"
              >Twitter</a>
              <a
                href="https://www.linkedin.com/company/superherolegion"
                target="_blank"
              >LinkedIn</a>
              <a
                href="https://www.instagram.com/superhero.chain/"
                target="_blank"
              >Instagram</a>
              <a
                href="https://superhero.com/terms"
                target="_blank"
              >Terms</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import VueAos from 'vue-aos';
import { mapState } from 'vuex';
import AeAmount from '../components/AeAmount.vue';

export default {
  components: {
    VueAos,
    AeAmount,
  },
  computed: mapState('backend', ['stats']),
  metaInfo: {
    title: 'Welcome',
  },
};
</script>
<style lang="scss">
:root {
  --animate-delay: 0.1s;

  /* Animation delay 10x faster */
  --animate-duration: 0.5s;
}

.landing-page {
  background: #f2f2f2;
  color: #212529;
  font-family: Oxygen, sans-serif;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 100vw !important;
  text-align: left;
}
</style>
<style lang="scss" scoped>
.landing-page-container {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 56px;
    font-style: normal;
    font-weight: 400;
    margin: 0;
  }

  h2 {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    margin: 0;
  }

  h3 {
    font-family: Oxygen, sans-serif;
    font-size: 12px;
    letter-spacing: 0.8px;
    line-height: 14px;
    margin: 0 0 12px;
    opacity: 0.6;
    text-shadow: 0 0 0 #000;
    text-transform: uppercase;
  }

  img {
    max-width: 100%;
    vertical-align: top;
  }

  .sh-container-fluid {
    margin: 0 auto;
    max-width: 1660px;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
  }

  .sh-container {
    margin: 0 auto;
    max-width: 1180px;
    overflow: hidden;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
  }

  .sh-btn-blue {
    background-color: #1161fe;
    border-radius: 4px;
    color: #fff;
    display: inline-block;
    font-family: Oxygen, sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 32px;
    text-decoration: none;
  }
}

.sh-row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
}

.sh-col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}

.sh-col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.sh-col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.sh-col-9 {
  flex: 0 0 75%;
  max-width: 75%;
}

.sh-col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.sh-d-flex {
  display: flex;
}

main#main {
  margin: auto;
  max-width: 1920px;
}

/* Header Started */
.sh-header {
  background-color: #000;
  color: #fff;
  left: 0;
  padding: 24px 20px 24px 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 99;

  a {
    text-decoration: none;
  }
}

.main-navbar {
  align-items: center;
  display: flex;
}

.sh-navbar {
  margin-left: auto;

  ul {
    align-items: center;
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;

    > li {
      margin-left: 18px;
    }

    a:not(.sh-btn-blue) {
      color: #fff;
      padding: 7px;
      text-decoration: none;
    }

    a:hover:not(.sh-btn-blue) {
      color: #1161fe;
    }

    .sh-btn-blue {
      padding: 7px 16px;
    }
  }
}

.toggle {
  align-items: center;
  background-color: #fff;
  border: none;
  border-radius: 2px;
  display: none;
  font-size: 20px;
  height: 38px;
  justify-content: center;
  margin-left: auto;
  padding: 0;
  width: 38px;
}

.header-logo {
  align-items: center;
  display: flex;
}

section.main-banner {
  background-color: #000;
  background-image: url('../assets/landing/banner-bg.jpg');
  background-position: bottom left;
  background-size: cover;
  position: relative;

  .banner-caption {
    align-items: center;
    color: #fff;
    display: flex;
    padding-top: 140px;

    h1 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 56px;
      font-weight: 400;
      line-height: 1.3;
      margin: 20px 0 25px 0;
    }

    span {
      color: rgba(255, 255, 255, 0.4);
      font-size: 1rem;
      font-weight: 600;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
    }

    .sh-btn-blue {
      margin-top: 50px;
    }
  }
}

.superhero-cta {
  background-color: #000;

  .sh-container {
    text-align: center;
  }

  .sh-btn-blue {
    position: relative;
    top: -70px;
  }
}

.mockup-img {
  margin: 90px;
  max-width: 350px;
}

section.superhero-story,
.superhero-tips {
  background-color: #e6e6e6;
  padding: 100px 0 0;

  .left-tips-img img {
    display: block;
    margin: 0 auto;
    max-height: 600px;
  }
}

.top-title {
  span {
    color: #000;
    font-size: 12px;
  }

  h2 {
    color: #000;
    font-size: 42px;
    font-weight: 600;
    margin: 0;
  }

  p {
    color: #000;
    font-size: 42px;
    margin: -10px 0 0 0;
  }
}

.right-share-text {
  color: #000;
  font-size: 18px;
  line-height: 32px;
  margin: 0;
  position: relative;
  top: 22px;

  p {
    margin-top: 0;
  }
}

.share-history {
  background: url(../assets/landing/icon-share.svg) no-repeat left center;
  background-size: 140px;
  padding: 0 0 0 165px;
}

.voting-img {
  background-color: #000;
  flex: 0 0 71%;
  max-width: 70%;

  img {
    width: 100%;
  }
}

.left-voting-box {
  background-color: #000;
  min-width: 353px;
}

.inner-left-voting-box {
  padding: 60px 50px 0;

  h4 {
    color: #fff;
    font-size: 22px;
    margin: 40px 0 30px 0;
  }

  p {
    color: #707070;
    font-size: 16px;
    line-height: 27px;
    margin: 0 0 12px;
  }

  img {
    max-height: 64px;
    max-width: 64px;
  }

  .bullets {
    position: relative;
    top: 50px;
  }
}

.bullets span {
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin: 0 10px 0 0;
  opacity: 0.7;
  width: 10px;

  &:nth-child(1) {
    background-color: #1161fe;
  }

  &:nth-child(2) {
    background-color: #00ff9d;
  }

  &:nth-child(3) {
    background-color: #00daff;
  }

  &:nth-child(4) {
    background-color: #dab5f7;
  }
}

.left-share {
  margin-bottom: 50px;
}

.sm-text-box {
  margin-top: 50px;

  h4 {
    color: #000;
    font-size: 26px;
    font-weight: 600;
    margin: 0 0 0;

    .ae-amount {
      color: $background_color;
    }
  }

  p {
    color: #000;
    font-size: 16px;
    line-height: 27px;
  }
}

section.superhero-tips {
  padding-bottom: 100px;

  .sh-row {
    align-items: center;
  }
}

.desc-hero {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px 15px;

  p {
    font-size: 16px;
  }
}

.desc p {
  font-size: 18px;
  line-height: 27px;
}

section.superhero-tokenization {
  background: url(../assets/landing/bg-black.png) no-repeat center center;
  background-size: cover;
  padding: 100px 0;

  .top-title {
    p {
      color: #fff;
    }

    span {
      color: #999;
    }

    h2 {
      color: #fff;
      font-size: 40px;
      font-weight: 400;
    }
  }
}

ul.custom-list {
  list-style: none;
  margin: 30px 0 0;
  padding: 0;

  li {
    font-size: 20px;
    margin: 0 0 12px 0;
    padding: 0 0 0 25px;
    position: relative;

    &:nth-child(1) {
      color: #dab5f7;
    }

    &:nth-child(2) {
      color: #d8f09b;
    }

    &:nth-child(3) {
      color: #a7f1b8;
    }

    &:nth-child(4) {
      color: #9cf0f0;
    }
  }

  li::before {
    border-radius: 50%;
    content: '';
    height: 8px;
    left: 0;
    position: absolute;
    top: 13px;
    width: 8px;

    &:nth-child(1) {
      background-color: #dab5f7;
    }

    &:nth-child(2) {
      background-color: #d8f09b;
    }

    &:nth-child(3) {
      background-color: #a7f1b8;
    }

    &:nth-child(4) {
      background-color: #9cf0f0;
    }
  }
}

section.superhero-crypto {
  background-color: #0f0f0f;
  padding: 100px 0;
}

.custom-title {
  h2 {
    color: #fff;
    font-size: 46px;
    font-weight: 400;
    margin: 0;
  }

  p {
    color: #999;
    font-size: 18px;
    line-height: 27px;
    max-width: 900px;
  }
}

.crypto-box {
  margin-top: 60px;

  img {
    max-width: 64px;
  }

  h4 {
    color: #fff;
    font-size: 22px;
    font-weight: 600;
    margin: 30px 0 20px 0;
  }

  p {
    color: #909090;
    font-size: 16px;
    line-height: 27px;
    padding: 0 50px 0 0;
  }
}

.superhero-sendTrips {
  background: #e6e6e6 url(../assets/landing/github.jpg) no-repeat left center;
  background-size: 700px 100%;
  padding: 100px 0;

  .left-tips {
    padding-left: 80px;

    img {
      display: inline-flex;
      margin: auto;
    }
  }
}

.sh-join {
  margin: 0 auto;
  max-width: 570px;
  text-align: left;
}

section.superhero-footer {
  background-color: #ededed;
  padding: 40px 0;
}

.left-foot p {
  color: #000;
  font-size: 16px;
  line-height: 27px;
  margin: 0;
}

.subscribe-form {
  input.form-control {
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 5px 0 0 5px;
    color: #000;
    font-size: 14px;
    height: 48px;
    padding: 5px 12px;
    width: 100%;
  }

  .form-group {
    display: flex;
    margin-bottom: 0;
  }
}

button.subscribe-button {
  background-color: #1161fe;
  border: 1px solid #0043b3;
  border-radius: 0 5px 5px 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  min-width: 154px;
}

.center-sh-foot p {
  color: #999;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.right-sh-foot {
  text-align: right;

  a {
    color: #000;
    font-size: 14px;
    margin: 0 0 0 20px;
    text-decoration: none;
  }
}

.bottom-footer {
  border-top: 2px solid #d8d8d880;
  margin: 30px auto 0;
  padding-top: 30px;

  &.top {
    border: none;
    margin-top: 0;
    padding-top: 0;
  }

  .sh-row {
    align-items: center;
  }
}

@media (max-width: 1150px) {
  .sh-container {
    max-width: 95%;
  }

  .left-voting-box {
    min-width: 290px;
  }

  .inner-left-voting-box {
    padding: 0 25px 0;
  }

  .inner-left-voting-box .bullets {
    top: 30px;
  }

  .top-title h2 {
    font-size: 30px;
  }

  .right-share-text {
    font-size: 15px;
    line-height: 32px;
    top: 0;
  }

  .sm-text-box p {
    font-size: 15px;
  }

  .desc p {
    font-size: 15px;
    line-height: 27px;
  }

  .desc-hero p {
    font-size: 14px;
  }

  .top-title p,
  .desc p {
    font-size: 20px;
    line-height: 30px;
  }

  .superhero-tokenization .top-title h2 {
    font-size: 26px;
  }

  ul.custom-list li {
    font-size: 15px;
  }

  .crypto-box p {
    font-size: 16px;
    line-height: 27px;
    padding: 0 20px 0 0;
  }

  .superhero-sendTrips {
    background-size: 530px 100%;
    padding: 40px 0;
  }
}

@media (max-width: 991px) {
  .sh-col-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .sh-col-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .sh-col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .sh-col-9 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .sh-col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .sm-text-box,
  .crypto-box {
    text-align: center;
  }

  .superhero-sendTrips .left-tips {
    background: rgba(255, 255, 255, 0.8);
    padding: 50px 30px;

    p {
      font-size: 20px;
      line-height: 40px;
    }
  }

  .left-foot p br {
    display: none;
  }

  .left-foot p {
    margin: 0 0 15px 0;
  }

  .bottom-footer {
    text-align: center;
  }

  .right-sh-foot {
    text-align: center;
  }

  .center-sh-foot p {
    margin: 15px 0 10px 0;
  }

  .banner-caption h1 {
    font-size: 38px;
  }
}

@media (max-width: 767px) {
  .main-navbar {
    flex-wrap: wrap;
  }

  .header-logo {
    justify-content: center;
    margin: 0 0 10px 0;
    width: 100%;
  }

  .sh-navbar {
    justify-content: center;
    margin-left: 0;
    text-align: center;
    width: 100%;
  }

  .sh-navbar ul {
    align-items: center;
    justify-content: center;
    margin: 10px 0 0;
  }
}

@media (max-width: 480px) {
  .sh-navbar ul {
    a:not(.sh-btn-blue) {
      font-size: 14px;
      padding: 6px;
    }

    a.sh-btn-blue {
      font-size: 14px;
      padding: 4px 12px;
    }

    > li {
      margin-left: 5px;
    }
  }
}
</style>
