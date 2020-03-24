<template>
    <div class="sh-dropdown" v-on:click.stop>
      <div class="overlay" @click="toggleShareList(false)" v-if="show"></div>
      <img :src="shareIcon" @click="toggleShareList(!show)">
      <div class="sh-dropdown-list" v-show="show">
        <div
          class="item"
          v-clipboard:copy="tip.url"
          v-clipboard:success="onCopy"
          v-clipboard:error="null"
          >
          Copy Link
          <span
            class="copy-msg"
            :class="[ successfulCopy ? 'show' : '']"
          >
            Copied Link!
          </span>
        </div>
        <!--TODO: twitter-user to be set-->

      <social-sharing :url="existingTipPreview()? tip.preview.responseUrl : ''"
        :title="title"
        :quote="title"
        :hashtags="hashtags"
        inline-template>
          <div>
            <network network="facebook" class="item">
              <i class="fa fa-facebook"></i> Facebook
            </network>
            <network network="twitter" class="item">
              <i class="fa fa-twitter"></i> Twitter
            </network>
          </div>
        </social-sharing>
      </div>
    </div>
</template>

<script>
import shareIcon from '../../assets/iconShare.svg';

export default {
  name: 'TipShare',
  props: ['tip'],
  data() {
    return {
      shareIcon,
      show: false,
      successfulCopy: false,
    };
  },
  computed: {
    title() {
      // window.location.origin can be replaced with https://youdonotneedacapetobeahero.com/
      // for testing purposes
      return `${window.location.origin}/#/tip/${this.tip.id}`;
    },
    hashtags() {
      if (this.tip.topics && this.tip.topics.length > 0) {
        const tags = this.tip.topics.map((tag) => tag.substring(1));
        return tags.join();
      }
      return '';
    },
  },
  methods: {
    existingTipPreview() {
      return this.tip.preview !== 'undefined';
    },
    toggleShareList(show) {
      this.show = show;
    },
    onCopy() {
      const that = this;
      this.successfulCopy = true;
      setTimeout(() => {
        that.successfulCopy = false;
      }, 1000);
    },
  },
};
</script>


<style lang="scss" >
.sh-dropdown {
  position: relative;
  display: inline-block;
}
.sh-dropdown-list {
  position: absolute;
  bottom: 1.5rem;
  right: 0;
  z-index: 10;
  background-color: $dark_background;
  color: $standard_font_color;
  border-radius: .25rem;
  padding: .4rem .85rem .6rem .85rem;
  min-width: 8rem;

  .item {
    display: block;
    line-height: 1.7rem;
    font-size: .7rem;
    &:hover {
      color: $custom_links_color;

      .copy-msg {
        color: $standard_font_color;
      }
    }
  }
}

.copy-msg {
  position: absolute;
  background: $dark_background;
  font-size: .6rem;
  top: -1.7rem;
  left: .5rem;
  padding: .25rem;
  display: none;
  line-height: 1rem;
  
  &.show {
    display: block;
  }
}
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .sh-dropdown-list {
      right: unset;
      left: 0;
    }
  }
</style>
