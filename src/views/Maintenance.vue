<template>
  <div class="maintenance">
    <h1>{{ $t('views.Maintenance.RechargeTitle') }}</h1>
    <img src="../assets/recharge.gif">
    <h2>{{ $t('views.Maintenance.RechargeSubTitle') }}</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['backendLive']),
  },
  mounted() {
    const interval = setInterval(() => this.$store.commit('reloading', true), 10 * 1000);

    this.$watch(() => this.backendLive, (backendLive) => {
      if (backendLive) {
        clearInterval(interval);
        this.$router.push('/');

        this.$store.commit('backendLive', false);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.maintenance {
  background-color: #14151f;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  @media (min-width: 400px) {
    position: fixed;
  }

  h1 {
    font-size: 55px;
    font-weight: bold;
    text-align: center;
    line-height: 80px;
    margin: 50px 1rem;
    color: white;
  }

  img {
    display: block;
    margin: 0 auto;
  }

  h2 {
    font-size: 35px;
    line-height: 55px;
    text-align: center;
    margin: 50px 1rem;
    color: #3290e2;
  }
}
</style>
