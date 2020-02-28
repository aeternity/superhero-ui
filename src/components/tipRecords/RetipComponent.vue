<template>
    <div class="tip__record row">
      <span class="tip__date--mobile">
        {{ new Date(tip.received_at).toLocaleString('en-US', { hourCycle: 'h24' }) }}
      </span>
      <div class="tip__body col-12">
        <div class="clearfix">
          <div class="tip__note pr-2 pb-2" :title="tip.note">
              {{ tip.note }}
          </div>
        </div>
        <div class="tip__footer text-ellipsis">
          <div class="row">
            <div class="col-lg-9 col-md-12">
              <span class="tip__amount" @click="retip(tip.url)" title="Send AE to this post">
                <img src="../../assets/heart.svg"><span>+ {{ tip.amount }}100 {{$t('system.aeid')}}</span><span class="currency-value"> (~ {{ tip.fiatValue }} {{current.currency.toUpperCase()}})</span>
              </span>
              <span class="tip__sender" :title="tip.sender"><span>{{$t('system.by')}}</span> {{ tip.sender }}</span>
            </div>
            <div class="col-lg-3 col-md-12 tip__date" >
              <span>
                {{ new Date(tip.received_at).toLocaleString('en-US', { hourCycle: 'h24' }) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import aeternity from '../../utils/aeternity';
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'TipRecord',
    props: ['tip', 'foundWallet'],
    data() {
      return { }
    },
    computed: {
      ...mapGetters(['current'])
    },
    methods: {
      async retip(url) {
        console.log('retip')
        const amount = util.aeToAtoms(prompt("Tip Amount in AE?"));
        this.showLoading = true;
        await aeternity.contract.methods.tip(url, undefined, {amount: amount}).catch(console.error);
        this.$store.commit('RELOAD_TIPS');
        this.showLoading = false;
      },
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../styles/base";
.tip__record .tip__body .tip__note{
  padding-left: 0;
}
.tip__record .tip__body .tip__footer{
  margin-left: 0;
}
.tip__record .tip__body .tip__note{
  height: initial; 
}
.tip__record{
  border: .065rem solid $secondary_color;
}
</style>
