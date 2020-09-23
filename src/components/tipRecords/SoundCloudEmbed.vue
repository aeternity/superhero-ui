<template>
  <div
    class="sound-cloud-player"
    @click.stop
  >
    <iframe
      v-if="isPlaying"
      width="100%"
      height="auto"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="playUrl"
    />
    <div
      v-else
      class="sound-cloud-preview"
    >
      <div class="sound-cloud-img">
        <img :src="tipPreviewImage">
      </div>

      <div class="sound-cloud-info">
        <div class="source">
          {{ sourceUrl.toUpperCase() }}
        </div>
        <h2
          class="title text-ellipsis"
          :title="tipPreviewTitle"
        >
          {{ tipPreviewTitle }}
        </h2>
        <div
          class="description"
          :title="tipPreviewDescription"
        >
          {{ tipPreviewDescription }}
        </div>
        <div
          v-if="!isPlaying"
          class="play"
          @click="play"
        >
          <img
            class="play-button"
            src="../../assets/buttonPlay.svg"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
    tipPreviewImage: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  data() {
    return {
      isPlaying: false,
      scApiUrl: 'https://w.soundcloud.com/player/',
      color: 'color=%231d1e27',
      autoplay: 'auto_play=true',
      related: 'hide_related=true',
      comments: 'show_comments=false',
      showUser: 'show_user=false',
      reposts: 'show_reposts=false',
      teaser: 'show_teaser=false',
    };
  },
  computed: {
    playParams() {
      return `&${this.color}&${this.autoplay}&${this.related}&${this.comments}&${this.showUser}&${this.reposts}&${this.teaser}`;
    },
    playUrl() {
      return `${this.scApiUrl}?url=${this.tip.url}${this.playParams}`;
    },
  },
  methods: {
    play() {
      this.isPlaying = true;
    },
  },
};
</script>

<style lang="scss">
    .sound-cloud-player {
        height: 100%;
    }

    .sound-cloud-preview {
        display: flex;
        flex-direction: row;
        height: auto;
        -webkit-transition: 0.4s all;
        -moz-transition: 0.4s all;
        transition: 0.4s all;

        .sound-cloud-img {
            flex: 0 0 35%;
            max-width: 35%;
            min-width: 35%;
            width: 35%;
            border-top-left-radius: 0.5rem;
            position: relative;
            padding-top: 35%;
            overflow: hidden;

            img {
                bottom: 0;
                display: block;
                left: 0;
                margin: auto;
                width: auto;
                position: absolute;
                top: 0;
                border: none;
                height: 100%;
                max-height: 100%;
                cursor: pointer;
                overflow: hidden;
            }
        }
        .sound-cloud-info {
            flex: 0 0 65%;
            max-width: 65%;
            min-width: 65%;
            width: 65%;
            height: 100%;
            padding: 0.5rem;

            .source {
                font-size: 0.5rem;
                color: $light_font_color;
                margin-bottom: 0.15rem;
            }

            .title {
                font-size: 0.8rem;
                font-weight: 500;
                margin-bottom: 0.15rem;
                color: $tip_note_color;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .play {
                height: 2.5rem;
                width: 2.5rem;
                margin-left: 0.5rem;
                margin-top: 0.5rem;
                cursor: pointer;
                background-color: $article_content_color;
                border-radius: 50%;

                .play-button {
                    width: 100%;
                    padding: 0.8rem;
                    margin-left: 0.15rem;
                }
            }

            .description {
                font-size: 0.7rem;
                color: $tip_note_color;
                height: 100%;
                overflow: hidden;
                white-space: pre-wrap;
                text-overflow: ellipsis;

                @include truncate-overflow-mx(3);
            }
        }
    }
</style>
