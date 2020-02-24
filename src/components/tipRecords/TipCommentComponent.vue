<template>
    <div class="tip__record row position-relative comment">
      <div class="left-arrow"></div>
      <span class="tip__date--mobile">
        {{ new Date(comment.createdAt).toLocaleString('en-US', { hourCycle: 'h24' }) }}
      </span>
      <div class="tip__body col-12">
        <div class="clearfix">
          <div class="tip__note pr-2" :title="comment.text">
              {{ comment.text }}
          </div>
        </div>
        <div class="tip__footer text-ellipsis">
          <div class="row">
            <div class="col-lg-9 col-md-12">
              <!-- <span class="tip__amount mr-2" @click="foundWallet && retip(tip.url)" title="Send AE to this comment">
                <img src="../../assets/heart.svg"> 
              </span>
              <span class="tip__comment mr-2" >
                <img src="../../assets/replyIcon.svg"> 
              </span> -->
              <span class="tip__sender" :title="comment.author"><span>{{$t('system.by')}}</span> 
              <a v-if="senderLink" :href="senderLink" target="_blank">{{ comment.author }}</a>
              <span class="tip__sender" v-else> {{ comment.author }}</span>
              </span>
            </div>
            <div class="col-lg-3 col-md-12 tip__date" >
              <span>
                {{ new Date(comment.createdAt).toLocaleString('en-US', { hourCycle: 'h24' }) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'TipComment',
    props: ['comment', 'foundWallet', 'retip', 'senderLink'],
    data() {
      return {
      }
    },
  }
</script>


<style lang="scss" scoped>
  @import "../../styles/base";
.tip__record .tip__body .tip__note{
  padding-left: 0;
  padding-bottom: .5rem;
}
.tip__record .tip__body .tip__footer{
  margin-left: 0;
}
.tip__record{
  background-color: $thumbnail_background_color;
}
.tip__record .tip__body .tip__footer{
  background: none;
}
.tip__record .tip__body .tip__note{
  height: initial; 
}
.left-arrow {
  @include vertical-align(absolute);
  border-color: transparent $thumbnail_background_color;
  border-style: solid;
  border-width: .5rem .6rem .5rem 0px;
  height: 0;
  width: 0;
  left: -.5rem;
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .comment.tip__record{
      padding-bottom: 2rem;
      .tip__body{
        padding-left: 0;
        .tip__note{
          padding-bottom: 0;
        }
        .tip__footer{
          bottom: -2rem;
          left: 0;
          right: .5rem;
          margin-right: -.5rem;
          .tip__sender {
            font-size: .38rem;
          }
        }
      } 
    }
 
  }
</style>