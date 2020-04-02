<template>
  <div>
    <div class="maintenance container wrapper mt-2">
      <div class="p-5 content text-center">
        <div v-if="view === 'recharge'">
          <div class="recharge">
            <h1>We're recharging our powers.</h1>
            <div class="gif" />
            <h2>We'll be up, up and away in no time.</h2>
          </div>
        </div>
        <div v-if="view === 'cleaning'">
          <div class="cleaning">
            <h1>Cleaning up the HQ.</h1>
            <div class="gif2" />
            <h2>We'll be flying again in a few minutes.</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Maintenance',
  data() {
    return {
      // cleaning or recharge
      view: 'recharge',
    };
  },
};
</script>


<style lang="scss" scoped>
.recharge {
  h1 {
    font-size: 55px;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 80px;
    margin: 50px 0;
  }
  .gif {
    background: url('../assets/recharge.gif') center center;
    display: block;
    height: 190px;
    width: 208px;
    margin: 0 auto;
    position: relative;
  }
  h2 {
    font-size: 35px !important;
    line-height: 55px;
    color: #3290E2;
    text-align: center;
    margin: 50px 0;
  }
}

.cleaning {
  h1 {
    font-size: 55px;
    font-weight: bold;
    color: #3290E2;
    text-align: center;
    line-height: 80px;
    margin: 50px 0;
  }
  .gif2 {
    background: url('../assets/ShieldFill.svg') center center;
    display: block;
    height: 220px;
    width: 255px;
    margin: 0 auto;
    position: relative;
  }
  h2 {
    font-size: 35px !important;
    line-height: 55px;
    color: white;
    text-align: center;
    margin: 50px 0;
  }
}
</style>
