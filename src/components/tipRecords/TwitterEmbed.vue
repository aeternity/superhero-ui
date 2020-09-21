<template>
  <div
    class="tweet-preview"
    @click="goToTip"
  >
    <div class="tweet-img">
      <img :src="tipPreviewImage">
    </div>

    <div class="tweet-info">
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
    goToTip: { type: Function, default: () => {} },
  },
};
</script>

<style lang="scss" scoped>
    .tweet-preview {
        display: flex;
        flex-direction: row;
        height: auto;

        .tweet-img {
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
                left: -17.5%;
                margin: auto;
                width: auto;
                position: absolute;
                top: 0;
                border: none;
                height: 100%;
                max-height: 100%;
                cursor: pointer;
                -webkit-transition: 0.4s all;
                -moz-transition: 0.4s all;
                transition: 0.4s all;
                overflow: hidden;
            }
        }
        .tweet-info {
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

      .description {
        font-size: 0.7rem;
        color: $tip_note_color;
        height: 100%;
        overflow: hidden;
            white-space: pre-wrap;

        text-overflow: ellipsis;

        @include truncate-overflow-mx(6);
      }
        }
    }

    @media only screen and (max-width: 1024px) {
    .description {
              @include truncate-overflow-mx(2);
    }
    }
</style>
